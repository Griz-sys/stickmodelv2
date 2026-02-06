import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateBlobPathname } from '@/lib/blob';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;

    try {
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          // Derive a stable folder structure per user + project
          let customPathname = pathname;

          try {
            if (clientPayload) {
              const payload = JSON.parse(clientPayload as string) as {
                projectId?: string;
                isAdminResponse?: boolean;
                fileName?: string;
              };

              if (payload.projectId && payload.fileName) {
                customPathname = generateBlobPathname(
                  user.id,
                  payload.projectId,
                  payload.fileName,
                  payload.isAdminResponse ?? false,
                );
              }
            }
          } catch (e) {
            console.error('Failed to parse clientPayload:', e);
          }

          // Validate upload permissions here if needed
          return {
            allowedContentTypes: [
              'application/pdf',
              'application/zip',
              'application/x-zip-compressed',
              'image/jpeg',
              'image/png',
              'image/gif',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'video/mp4',
              'video/quicktime',
              'video/x-msvideo',
              'video/webm',
            ],
            addRandomSuffix: true,
            pathname: customPathname,
            tokenPayload: JSON.stringify({
              userId: user.id,
              userRole: user.role,
            }),
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          // File upload completed successfully
          console.log('Blob upload completed:', blob.pathname);
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
