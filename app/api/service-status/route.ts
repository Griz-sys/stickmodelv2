import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  DEFAULT_SERVICE_STATUS,
  isServiceMode,
  type ServiceStatus,
} from '@/lib/service-status';

const STATUS_ID = 'global';

function serialize(row: {
  mode: string;
  resumeDate: Date | null;
  waitDays: number | null;
  customRate: string | null;
  note: string | null;
  updatedAt: Date;
}): ServiceStatus {
  return {
    mode: isServiceMode(row.mode) ? row.mode : 'standard',
    resumeDate: row.resumeDate ? row.resumeDate.toISOString() : null,
    waitDays: row.waitDays,
    customRate: row.customRate,
    note: row.note,
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Get current delivery status (any signed-in user)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const row = await prisma.serviceStatus.findUnique({
      where: { id: STATUS_ID },
    });

    return NextResponse.json({
      status: row ? serialize(row) : DEFAULT_SERVICE_STATUS,
    });
  } catch (error) {
    console.error('Get service status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update delivery status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { mode, resumeDate, waitDays, customRate, note } = body;

    if (!isServiceMode(mode)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    let parsedResumeDate: Date | null = null;
    if (mode === 'off') {
      parsedResumeDate = resumeDate ? new Date(resumeDate) : null;
      if (!parsedResumeDate || isNaN(parsedResumeDate.getTime())) {
        return NextResponse.json(
          { error: 'Resume date is required' },
          { status: 400 }
        );
      }
    }

    let parsedWaitDays: number | null = null;
    if (mode === 'busy_standard' || mode === 'busy_discount') {
      parsedWaitDays = Number(waitDays);
      if (!Number.isInteger(parsedWaitDays) || parsedWaitDays < 1) {
        return NextResponse.json(
          { error: 'Waiting days must be a whole number of at least 1' },
          { status: 400 }
        );
      }
    }

    let parsedCustomRate: string | null = null;
    if (mode === 'busy_discount') {
      parsedCustomRate =
        typeof customRate === 'string' ? customRate.trim() : '';
      if (!parsedCustomRate) {
        return NextResponse.json(
          { error: 'Discounted rate is required' },
          { status: 400 }
        );
      }
    }

    const trimmedNote =
      typeof note === 'string' && note.trim() ? note.trim() : null;

    const data = {
      mode,
      resumeDate: parsedResumeDate,
      waitDays: parsedWaitDays,
      customRate: parsedCustomRate,
      note: trimmedNote,
    };

    const row = await prisma.serviceStatus.upsert({
      where: { id: STATUS_ID },
      create: { id: STATUS_ID, ...data },
      update: data,
    });

    return NextResponse.json({ status: serialize(row) });
  } catch (error) {
    console.error('Update service status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
