#!/usr/bin/env node

/**
 * Mock receiver for FILE_UPLOAD_WEBHOOK_URL — for local testing only.
 *
 * Usage:
 *   node scripts/mock-webhook-server.js [--port=4545] [--secret=<secret>] [--fail=2] [--hang]
 *
 *   --port    Port to listen on (default 4545)
 *   --secret  Shared secret. When set, the server VERIFIES the request:
 *             - X-Webhook-Signature must be a valid HMAC-SHA256 of the raw body
 *             - X-Webhook-Timestamp must be within 5 minutes of now
 *             - X-Webhook-Secret (legacy header) must match the secret
 *             Valid requests get 200, invalid get 401.
 *             Without --secret, verification is skipped and requests always get 200.
 *   --fail    Respond 500 to the first N requests, then 200 after that (tests the retry logic)
 *   --hang    Never respond (tests the 10s fetch timeout in lib/webhook.ts)
 *
 * Point the app at it:
 *   FILE_UPLOAD_WEBHOOK_URL=http://localhost:4545/webhook
 *   FILE_UPLOAD_WEBHOOK_SECRET=<secret>
 */

const http = require('http');
const crypto = require('crypto');

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? true];
  })
);

const PORT = Number(args.port) || 4545;
const EXPECTED_SECRET = args.secret ? String(args.secret) : null;
const FAIL_COUNT = Number(args.fail) || 0;
const SHOULD_HANG = Boolean(args.hang);
const TIMESTAMP_TOLERANCE_SEC = 5 * 60;

let requestCount = 0;

function safeEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifySignature(rawBody, headers) {
  const received = headers['x-webhook-signature'];
  const timestamp = headers['x-webhook-timestamp'];
  const legacySecret = headers['x-webhook-secret'];

  if (!received) {
    return { ok: false, reason: 'missing X-Webhook-Signature header' };
  }
  if (!timestamp) {
    return { ok: false, reason: 'missing X-Webhook-Timestamp header' };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > TIMESTAMP_TOLERANCE_SEC) {
    return { ok: false, reason: `X-Webhook-Timestamp ${timestamp} is outside the ${TIMESTAMP_TOLERANCE_SEC}s freshness window` };
  }

  const prefix = 'sha256=';
  if (!received.startsWith(prefix)) {
    return { ok: false, reason: `X-Webhook-Signature must start with "${prefix}"` };
  }

  const expected = crypto.createHmac('sha256', EXPECTED_SECRET).update(rawBody, 'utf8').digest('hex');
  if (!safeEqual(received.slice(prefix.length), expected)) {
    return { ok: false, reason: 'X-Webhook-Signature does not match the HMAC-SHA256 of the request body' };
  }

  if (legacySecret !== undefined && !safeEqual(legacySecret, EXPECTED_SECRET)) {
    return { ok: false, reason: 'X-Webhook-Secret (legacy header) does not match the expected secret' };
  }

  return { ok: true };
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }

  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    requestCount += 1;

    console.log(`\n[${new Date().toISOString()}] Request #${requestCount}`);
    console.log('Headers:', {
      'content-type': req.headers['content-type'],
      'x-webhook-signature': req.headers['x-webhook-signature'] || '(none)',
      'x-webhook-timestamp': req.headers['x-webhook-timestamp'] || '(none)',
      'x-webhook-secret': req.headers['x-webhook-secret'] ? '(present)' : '(none)',
    });

    if (SHOULD_HANG) {
      console.log('⏳ --hang set: not responding (simulating a stuck endpoint)');
      return; // never call res.end() — client will time out after 10s per lib/webhook.ts
    }

    if (requestCount <= FAIL_COUNT) {
      console.log(`❌ --fail=${FAIL_COUNT} set: responding 500 (attempt ${requestCount}/${FAIL_COUNT})`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Simulated failure' }));
      return;
    }

    if (EXPECTED_SECRET) {
      const result = verifySignature(body, req.headers);
      if (!result.ok) {
        console.log(`⛔ Verification failed: ${result.reason}`);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid webhook signature', reason: result.reason }));
        return;
      }
      console.log('🔑 Signature verified (HMAC-SHA256 + timestamp + legacy secret)');
    } else {
      console.log('⚠️  No --secret set: skipping signature verification (dev mode)');
    }

    try {
      console.log('Payload:', JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      console.log('Payload (raw, failed to parse as JSON):', body);
    }

    console.log('✅ Responding 200');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: true }));
  });
});

server.listen(PORT, () => {
  console.log(`Mock webhook receiver listening on http://localhost:${PORT}/webhook`);
  console.log(`\nSet in your .env:`);
  console.log(`  FILE_UPLOAD_WEBHOOK_URL=http://localhost:${PORT}/webhook`);
  if (EXPECTED_SECRET) console.log(`  FILE_UPLOAD_WEBHOOK_SECRET=${EXPECTED_SECRET}`);
  console.log('');
});
