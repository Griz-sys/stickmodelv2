import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Update queue order for a user's waiting projects
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'orderedIds must be a non-empty array' }, { status: 400 });
    }

    // Verify all projects belong to this user and are in a waiting state
    const userProjects = await prisma.project.findMany({
      where: {
        id: { in: orderedIds },
        userId: user.id,
      },
      select: { id: true },
    });

    if (userProjects.length !== orderedIds.length) {
      return NextResponse.json({ error: 'Unauthorized or project not found' }, { status: 403 });
    }

    // Update queue order for each project
    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        prisma.project.update({
          where: { id },
          data: { queueOrder: index + 1 },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update queue order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
