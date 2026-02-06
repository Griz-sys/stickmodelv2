import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateBlobPathname } from '@/lib/blob';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, fileName, fileSize, fileType, description } = body;

    if (!projectId || !fileName || !fileSize || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Admin can upload to any project, users can only upload to their own
    const targetUserId = user.role === 'admin' && project.userId 
      ? project.userId 
      : user.id;

    if (user.role !== 'admin' && project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Determine if this is an admin response file
    const isAdminResponse = user.role === 'admin';

    // Generate blob pathname with proper folder structure
    // User uploads go to: users/{userId}/projects/{projectId}/uploads/
    // Admin responses go to: users/{userId}/projects/{projectId}/responses/
    const blobPath = generateBlobPathname(targetUserId, projectId, fileName, isAdminResponse);

    // Create submission record (blob URL will be added after upload)
    const submission = await prisma.submission.create({
      data: {
        projectId,
        userId: targetUserId,
        fileName,
        fileSize,
        fileType,
        s3Key: blobPath, // Using s3Key field to store blob pathname
        uploadedBy: user.role,
        uploaderId: user.id,
        description,
      },
    });

    // Return submission with upload configuration
    return NextResponse.json({
      submission,
      uploadConfig: {
        pathname: blobPath,
        maxSize: 50 * 1024 * 1024, // 50MB
        contentType: fileType,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get submissions for a project
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Check access to project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get submissions
    const submissions = await prisma.submission.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
