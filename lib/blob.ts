/**
 * DigitalOcean Spaces (S3-compatible) storage utilities
 */

// Verify DO Spaces is configured
if (!process.env.DO_SPACES_ENDPOINT || !process.env.DO_SPACES_ACCESS_KEY_ID) {
  console.warn('??  DigitalOcean Spaces credentials not set. File uploads will not work.');
}

/**
 * Generate a unique pathname for a file in DO Spaces
 * Structure: users/{userId}/projects/{projectId}/uploads/{fileName}
 * or: users/{userId}/projects/{projectId}/responses/{fileName}
 * 
 * @param userId - The user ID
 * @param projectId - The project ID
 * @param fileName - The original file name
 * @param isAdminResponse - Whether this is an admin response file (default: false)
 */
export function generateBlobPathname(
  userId: string,
  projectId: string,
  fileName: string,
  isAdminResponse: boolean = false
): string {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const folderType = isAdminResponse ? 'responses' : 'uploads';
  return `users/${userId}/projects/${projectId}/${folderType}/${sanitizedFileName}`;
}
