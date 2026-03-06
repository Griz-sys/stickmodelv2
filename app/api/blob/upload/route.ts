import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateBlobPathname } from '@/lib/blob';

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || 'sfo3',
  endpoint: process.env.DO_SPACES_S3_ENDPOINT || 'https://sfo3.digitaloceanspaces.com',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const isAdminResponse = formData.get('isAdminResponse') === 'true';

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'Missing file or projectId' },
        { status: 400 }
      );
    }

    // Validate content type
    const allowedContentTypes = [
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
    ];

    if (!allowedContentTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Content type ${file.type} not allowed` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Generate the S3 key (pathname)
    const key = generateBlobPathname(user.id, projectId, file.name, isAdminResponse);

    // Upload to DigitalOcean Spaces
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET || 'stickmodel',
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3.send(command);

    // Return the public URL of where the file was uploaded
    const publicUrl = `${process.env.DO_SPACES_ENDPOINT}/${key}`;

    return NextResponse.json({
      url: publicUrl,
      key: key,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
