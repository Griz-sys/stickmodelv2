import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where =
      user?.role === 'admin'
        ? status ? { status } : undefined
        : { status: 'published' };

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Get blog posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, bodyContent, coverImage, category, status } = body;

    if (!title || !excerpt || !bodyContent || !coverImage || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = await uniqueSlug(generateSlug(title));

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        body: bodyContent,
        coverImage,
        category: category.toUpperCase(),
        status: status || 'draft',
        authorId: user.id,
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: { author: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
