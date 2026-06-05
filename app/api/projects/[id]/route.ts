import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendUserFileUploadNotification, sendDeliverableUploadNotification, sendProjectFinishedNotification, sendNoteAddedNotification } from '@/lib/email';

// Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check access
    if (user.role !== 'admin' && project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Payment gating: non-admin users only see adminFileUrl when they have paid (or there's no cost)
    if (user.role !== 'admin') {
      let gated = project as Record<string, unknown>;

      if (gated.cost && (gated.cost as number) > 0 && !gated.isPaidInitial) {
        gated = { ...gated, adminFileUrl: null };
      }

      if (Array.isArray(gated.steps)) {
        gated = {
          ...gated,
          steps: (gated.steps as Array<Record<string, unknown>>).map((step) => {
            if (step.cost && (step.cost as number) > 0 && !step.isPaid) {
              return { ...step, adminFileUrl: null };
            }
            return step;
          }),
        };
      }

      return NextResponse.json({ project: gated });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a project (admin only)
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

    // Fetch existing project to check ownership
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Admins can update any fields
    if (user.role === 'admin') {
      // Strip email-only fields before passing to Prisma
      const { sendEmailNotification, emailSubject, emailBody, emailBcc, ...projectData } = body;

      // Stamp dateConfirmed the first time admin moves status to in_progress.
      // Done via raw SQL to avoid any cached-client schema mismatch issues.
      const shouldSetConfirmed =
        projectData.status === 'in_progress' &&
        !(existing as Record<string, unknown>).dateConfirmed;

      const project = await prisma.project.update({ where: { id }, data: projectData });

      if (shouldSetConfirmed) {
        await prisma.$executeRaw`UPDATE projects SET "dateConfirmed" = NOW() WHERE id = ${id}`;
      }

      // Send project finished email if status changed to finished
      if (projectData.status === 'finished' && sendEmailNotification && existing.userId) {
        const userInfo = await prisma.user.findUnique({ where: { id: existing.userId } });
        if (userInfo) {
          await sendProjectFinishedNotification(
            existing.name,
            userInfo.name,
            userInfo.email,
            emailSubject,
            emailBody,
            emailBcc
          );
        }
      }

      // Send email to user if admin uploaded initial deliverable
      if (projectData.adminFileName && existing.userId) {
        const userInfo = await prisma.user.findUnique({ where: { id: existing.userId } });
        if (userInfo) {
          await sendDeliverableUploadNotification(
            existing.name,
            userInfo.name,
            userInfo.email,
            projectData.adminFileName,
            'Initial Submission',
            projectData.cost
          );
        }
      }

      return NextResponse.json({ project });
    }

    // Non-admin users may only update their own project and only specific fields
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allowedKeys = ['notes'];
    const canAttachInitialFile =
      !existing.userFileName &&
      !existing.userFileUrl &&
      !existing.userFileSize &&
      !existing.userFileType;

    if (canAttachInitialFile) {
      allowedKeys.push(
        'userFileName',
        'userFileUrl',
        'userFileSize',
        'userFileType'
      );
    }

    const updateData: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updateData[key] = body[key];
      }
    }

    const project = await prisma.project.update({ where: { id }, data: updateData });

    const userInfo = await prisma.user.findUnique({ where: { id: existing.userId! } });

    // Send email to admins if user uploaded initial file
    if (body.userFileName && userInfo) {
      await sendUserFileUploadNotification(
        existing.name,
        userInfo.name,
        userInfo.email,
        body.userFileName,
        'Initial Submission'
      );
    }

    // Send email to admins if user added/updated a note
    if (body.notes && userInfo) {
      await sendNoteAddedNotification(
        id,
        existing.name,
        userInfo.name,
        userInfo.email,
        body.notes
      );
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
