#!/usr/bin/env tsx
/**
 * End-to-end smoke test for the file-upload webhook.
 *
 * Fires one signed payload through lib/webhook.ts's notifyFileUploadWebhook().
 * Point it at scripts/mock-webhook-server.js first, e.g.:
 *
 *   node scripts/mock-webhook-server.js --port=4545 --secret=testsecret
 *
 * Then run with the same secret:
 *
 *   FILE_UPLOAD_WEBHOOK_URL=http://localhost:4545/webhook \
 *   FILE_UPLOAD_WEBHOOK_SECRET=testsecret \
 *   npx tsx scripts/e2e-webhook-test.ts
 *
 * Expected output: "File upload webhook delivered to ... (attempt 1)".
 * Run with a wrong/missing secret (or NODE_ENV=production without a secret)
 * to observe the fail-closed path.
 */

import { notifyFileUploadWebhook } from '../lib/webhook';

const payload = {
  event: 'user_file_upload' as const,
  projectId: 'proj-e2e',
  projectName: 'E2E Test Project',
  stepId: 'step-e2e',
  stepLabel: 'E2E Step',
  fileName: 'test.txt',
  fileUrl: 'https://example.com/test.txt',
  fileSize: 123,
  fileType: 'text/plain',
  uploadedBy: { id: 'u1', name: 'Test User', email: 'test@example.com' },
  uploadedAt: new Date().toISOString(),
};

async function main() {
  notifyFileUploadWebhook(payload);
  // Give the fire-and-forget POST time to complete so its log lines appear.
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

main();
