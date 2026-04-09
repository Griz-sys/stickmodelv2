import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendUserFileUploadNotification, sendDeliverableUploadNotification } from '@/lib/email';

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

    // For non-admin users, strip adminFileUrl/adminFileName from unpaid content
    // so download URLs are never exposed client-side until payment is confirmed
    if (user.role !== 'admin') {
      const sanitizedProject = { ...project };
      
      // Hide actual download URL if not paid; keep filename/size so the UI
      // can show the payment panel instead of "No deliverable yet".
      if (!project.isPaidInitial) {
        sanitizedProject.adminFileUrl = null;
      }
      
      // Hide step deliverables if not paid
      const sanitizedSteps = project.steps.map((step) => {
        if (!step.isPaid) {
          return {
            ...step,
            adminFileUrl: null,
            adminFileName: null,
            adminFileSize: null,
            adminFileType: null,
          };
        }
        return step;
      });
      
      return NextResponse.json({ project: { ...sanitizedProject, steps: sanitizedSteps } });
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
      const project = await prisma.project.update({ where: { id }, data: body });
      
      // Send email to user if admin uploaded initial deliverable
      if (body.adminFileName && existing.userId) {
        const userInfo = await prisma.user.findUnique({ where: { id: existing.userId } });
        if (userInfo) {
          await sendDeliverableUploadNotification(
            existing.name,
            userInfo.name,
            userInfo.email,
            body.adminFileName,
            'Initial Submission',
            body.cost
          );
        }
      }
      
      return NextResponse.json({ project });
    }

    // Non-admin users may only update their own project and only specific fields
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allowedKeys = [
      'userFileName',
      'userFileUrl',
      'userFileSize',
      'userFileType',
      'notes',
    ];

    const updateData: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updateData[key] = body[key];
      }
    }

    const project = await prisma.project.update({ where: { id }, data: updateData });
    
    // Send email to admins if user uploaded initial file
    if (body.userFileName && existing.userId) {
      const userInfo = await prisma.user.findUnique({ where: { id: existing.userId } });
      if (userInfo) {
        await sendUserFileUploadNotification(
          existing.name,
          userInfo.name,
          userInfo.email,
          body.userFileName,
          'Initial Submission'
        );
      }
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
