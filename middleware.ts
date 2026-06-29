import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

const publicPaths = ['/', '/login', '/signup', '/about', '/pricing', '/contact', '/faq', '/terms'];
const adminPaths = ['/admin', '/blog/new'];

function isPublicBlogPath(pathname: string): boolean {
  if (pathname === '/blog') return true;
  if (!pathname.startsWith('/blog/')) return false;
  if (pathname === '/blog/new') return false;
  if (pathname.endsWith('/edit')) return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow exact public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public blog paths (listing + individual posts, not /new or /edit)
  if (isPublicBlogPath(pathname)) {
    return NextResponse.next();
  }

  // Check authentication
  const user = await getUserFromRequest(request);

  // Redirect to login if not authenticated
  if (!user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Check admin access for admin paths and blog edit/new routes
  const isBlogEdit = pathname.startsWith('/blog/') && pathname.endsWith('/edit');
  if (adminPaths.some(path => pathname.startsWith(path)) || isBlogEdit) {
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - models directory (3D model assets)
     * - static file extensions (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|models|.*\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|glb|gltf|mp4|webm|ogg|mov|mkv)).*)',
  ],
};
