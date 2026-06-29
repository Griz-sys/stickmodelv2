import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const user = await getCurrentUser();

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (post.status !== 'published' && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Get blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, bodyContent, coverImage, category, status } = body;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const wasPublished = existing.status === 'published';
    const isPublishing = status === 'published' && !wasPublished;

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        title: title ?? existing.title,
        excerpt: excerpt ?? existing.excerpt,
        body: bodyContent ?? existing.body,
        coverImage: coverImage ?? existing.coverImage,
        category: category ? category.toUpperCase() : existing.category,
        status: status ?? existing.status,
        publishedAt: isPublishing ? new Date() : existing.publishedAt,
      },
      include: { author: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
