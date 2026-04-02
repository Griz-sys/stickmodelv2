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
          <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 text-sm">
            stickmodel.com
          </span>
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
