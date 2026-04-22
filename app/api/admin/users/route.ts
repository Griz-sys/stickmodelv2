import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        designation: true,
        companyName: true,
        companyEmail: true,
        companyWebsite: true,
        phone: true,
        location: true,
        billingAddress: true,
        billingContactName: true,
        billingContactPhone: true,
        referralSource: true,
        referralDetail: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name, email, password,
      designation, companyName, companyEmail, companyWebsite,
      phone, location,
      billingAddress, billingContactName, billingContactPhone,
      referralSource, referralDetail,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        designation: designation || null,
        companyName: companyName || null,
        companyEmail: companyEmail || null,
        companyWebsite: companyWebsite || null,
        phone: phone || null,
        location: location || null,
        billingAddress: billingAddress || null,
        billingContactName: billingContactName || null,
        billingContactPhone: billingContactPhone || null,
        referralSource: referralSource || null,
        referralDetail: referralDetail || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        designation: true,
        companyName: true,
        companyEmail: true,
        companyWebsite: true,
        phone: true,
        location: true,
        billingAddress: true,
        billingContactName: true,
        billingContactPhone: true,
        referralSource: true,
        referralDetail: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
