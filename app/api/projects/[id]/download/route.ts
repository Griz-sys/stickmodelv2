import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendDeliverableDownloadNotification } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admins downloading their own deliverables shouldn't trigger a notification
    if (user.role === 'admin') {
      return NextResponse.json({ success: true });
    }

    const { id } = await params;
    const { stepId } = await request.json().catch(() => ({}));

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        steps: { where: stepId ? { id: stepId } : undefined },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userName = project.user?.name || user.email || 'Unknown User';
    const userEmail = project.user?.email || user.email || '';

    if (stepId) {
      const step = project.steps[0];
      if (step?.adminFileName) {
        await sendDeliverableDownloadNotification(
          id,
          project.name,
          userName,
          userEmail,
          step.adminFileName,
          step.userLabel || undefined
        );
      }
    } else if (project.adminFileName) {
      await sendDeliverableDownloadNotification(
        id,
        project.name,
        userName,
        userEmail,
        project.adminFileName
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Download notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
