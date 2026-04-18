import Link from "next/link";

export function SimpleNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200"
      style={{ height: "60px" }}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/horizontal.svg" alt="StickModel" className="h-7 w-auto" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/#about"
            className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
