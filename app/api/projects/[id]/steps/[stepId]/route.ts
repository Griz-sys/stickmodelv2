import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendDeliverableUploadNotification } from '@/lib/email';

// PATCH - update a step (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, stepId } = await params;

    const step = await prisma.projectStep.findUnique({ where: { id: stepId } });
    if (!step || step.projectId !== id) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const body = await request.json();

    if (user.role === 'admin') {
      const updated = await prisma.projectStep.update({ where: { id: stepId }, data: body });

      // Send email to user if admin uploaded deliverable
      if (body.adminFileName) {
        const project = await prisma.project.findUnique({
          where: { id },
          include: { user: true },
        });

        if (project?.user) {
          const stepLabel = step.userLabel;
          await sendDeliverableUploadNotification(
            project.name,
            project.user.name,
            project.user.email,
            body.adminFileName,
            stepLabel,
            body.cost
          );
        }
      }

      return NextResponse.json({ step: updated });
    }

    // Project owner can update only their own file fields
    const project = await prisma.project.findUnique({ where: { id } });
    if (project?.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allowedKeys = ['userFileName', 'userFileUrl', 'userFileSize', 'userFileType'];
    const updateData: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updateData[key] = body[key];
      }
    }

    const updated = await prisma.projectStep.update({ where: { id: stepId }, data: updateData });
    return NextResponse.json({ step: updated });
  } catch (error) {
    console.error('Update step error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - admin clears the deliverable fields from a step
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, stepId } = await params;

    const step = await prisma.projectStep.findUnique({ where: { id: stepId } });
    if (!step || step.projectId !== id) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const updated = await prisma.projectStep.update({
      where: { id: stepId },
      data: {
        adminFileName: null,
        adminFileUrl: null,
        adminFileSize: null,
        adminFileType: null,
      },
    });

    return NextResponse.json({ step: updated });
  } catch (error) {
    console.error('Remove step deliverable error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
