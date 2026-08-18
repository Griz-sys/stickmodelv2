/**
 * Outbound webhook for notifying an external pipeline whenever a project file is uploaded
 */

import crypto from 'crypto';

interface FileUploadWebhookPayload {
  event: 'user_file_upload' | 'admin_deliverable_upload';
  projectId: string;
  projectName: string;
  stepId?: string;
  stepLabel?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number | null;
  fileType?: string | null;
  uploadedBy: { id: string; name: string; email: string };
  uploadedAt: string;
}

const WEBHOOK_TIMEOUT_MS = 10_000;
const WEBHOOK_MAX_ATTEMPTS = 3;
const WEBHOOK_RETRY_BASE_DELAY_MS = 500;
const WEBHOOK_SIGNATURE_PREFIX = 'sha256=';

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function isLocalhostHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

/**
 * Validate the webhook URL before sending:
 * - must be an absolute http(s) URL
 * - must not embed credentials in the URL itself
 * - plain http is only allowed for localhost (dev/test); production requires https
 */
function isValidWebhookUrl(
  rawUrl: string
): { ok: true; url: URL } | { ok: false; reason: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: 'FILE_UPLOAD_WEBHOOK_URL is not a valid absolute URL' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return {
      ok: false,
      reason: `FILE_UPLOAD_WEBHOOK_URL uses unsupported scheme "${parsed.protocol}" (only http/https are allowed)`,
    };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, reason: 'FILE_UPLOAD_WEBHOOK_URL must not contain embedded credentials' };
  }

  if (parsed.protocol === 'http:' && isProduction() && !isLocalhostHostname(parsed.hostname)) {
    return {
      ok: false,
      reason: 'FILE_UPLOAD_WEBHOOK_URL must use https in production (plain http is only allowed for localhost)',
    };
  }

  return { ok: true, url: parsed };
}

/** HMAC-SHA256 over the exact raw JSON body string sent to the receiver. */
function signBody(secret: string, body: string): string {
  return crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');
}

async function postWithRetry(url: string, body: string, headers: Record<string, string>): Promise<void> {
  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    try {
      const response = await fetch(url, { method: 'POST', headers, body, signal: controller.signal });
      if (response.ok) {
        console.log(`File upload webhook delivered to ${url} (attempt ${attempt})`);
        return;
      }
      throw new Error(`Webhook responded with status ${response.status}`);
    } catch (error) {
      if (attempt === WEBHOOK_MAX_ATTEMPTS) {
        console.error(`File upload webhook failed after ${WEBHOOK_MAX_ATTEMPTS} attempts (URL: ${url}):`, error);
        return;
      }
      const delay = WEBHOOK_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(`File upload webhook attempt ${attempt} failed (URL: ${url}); retrying in ${delay}ms:`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function notifyFileUploadWebhook(payload: FileUploadWebhookPayload): void {
  const url = process.env.FILE_UPLOAD_WEBHOOK_URL;
  if (!url) return; // not configured — no-op, as documented

  const validation = isValidWebhookUrl(url);
  if (!validation.ok) {
    console.error(`File upload webhook skipped: ${validation.reason}`);
    return;
  }

  const secret = process.env.FILE_UPLOAD_WEBHOOK_SECRET;
  if (!secret) {
    if (isProduction()) {
      console.error(
        'File upload webhook skipped: FILE_UPLOAD_WEBHOOK_SECRET is not set (required in production to authenticate the request)'
      );
      return;
    }
    console.warn(
      'File upload webhook: FILE_UPLOAD_WEBHOOK_SECRET is not set; sending without authentication (dev only)'
    );
  }

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (secret) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    headers['X-Webhook-Signature'] = `${WEBHOOK_SIGNATURE_PREFIX}${signBody(secret, body)}`;
    headers['X-Webhook-Timestamp'] = timestamp;
    // Legacy header kept for backward compatibility with receivers that check it directly
    headers['X-Webhook-Secret'] = secret;
  }

  void postWithRetry(validation.url.toString(), body, headers);
}
