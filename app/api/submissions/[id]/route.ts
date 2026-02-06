import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { blobUrl } = body;

    if (!blobUrl) {
      return NextResponse.json(
        { error: 'Blob URL is required' },
        { status: 400 }
      );
    }

    // Get submission to verify ownership
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Verify user has access to update this submission
    if (user.role !== 'admin' && submission.uploaderId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update submission with blob URL
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: { s3Url: blobUrl },
    });

    return NextResponse.json({ submission: updatedSubmission });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
