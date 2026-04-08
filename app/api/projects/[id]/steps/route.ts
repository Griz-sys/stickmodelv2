import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET - list all steps for a project
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    if (user.role !== 'admin' && project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const steps = await prisma.projectStep.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('Get steps error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - user creates a new step with a label (and optional file info)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    if (user.role !== 'admin' && project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userLabel, userFileName, userFileUrl, userFileSize, userFileType } = body;

    if (!userLabel || !userLabel.trim()) {
      return NextResponse.json({ error: 'Step label is required' }, { status: 400 });
    }

    // Determine order (max existing order + 1)
    const lastStep = await prisma.projectStep.findFirst({
      where: { projectId: id },
      orderBy: { order: 'desc' },
    });
    const order = lastStep ? lastStep.order + 1 : 1;

    const step = await prisma.projectStep.create({
      data: {
        projectId: id,
        order,
        userLabel: userLabel.trim(),
        userFileName: userFileName ?? null,
        userFileUrl: userFileUrl ?? null,
        userFileSize: userFileSize ?? null,
        userFileType: userFileType ?? null,
      },
    });

    return NextResponse.json({ step }, { status: 201 });
  } catch (error) {
    console.error('Create step error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
