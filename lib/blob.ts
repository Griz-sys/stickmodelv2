import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// Verify Blob token is configured
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.warn('⚠️  BLOB_READ_WRITE_TOKEN is not set. File uploads will not work.');
}

/**
 * Generate a unique blob pathname for a file with proper folder structure
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

/**
 * Generate client upload token for Vercel Blob
 * This is called from the API route to provide the client with upload credentials
 */
export async function generateClientUploadToken(
  pathname: string,
  options: {
    contentType: string;
    maximumSizeInBytes?: number;
  }
): Promise<{ url: string; token: string }> {
  // Vercel Blob will handle the token generation
  // The client will use this token to upload directly
  return {
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/blob/upload`,
    token: pathname, // This will be used as the pathname
  };
}

/**
 * Legacy function name for compatibility
 * @deprecated Use generateBlobPathname instead
 */
export function generateS3Key(
  userId: string,
  projectId: string,
  fileName: string
): string {
  return generateBlobPathname(userId, projectId, fileName);
}
