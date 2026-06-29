import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || 'sfo3',
  endpoint: process.env.DO_SPACES_S3_ENDPOINT || 'https://sfo3.digitaloceanspaces.com',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY || '',
  },
});

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 10 MB' }, { status: 413 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const key = `blog/covers/${safeName}`;

    const buffer = await file.arrayBuffer();

    await s3.send(new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET || 'stickmodel',
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      ACL: 'public-read',
    }));

    const publicUrl = `${process.env.DO_SPACES_ENDPOINT}/${key}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Blog cover upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
