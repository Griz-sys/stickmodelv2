"use client";

import CardNav from "@/components/CardNav";
import type { CardNavItem } from "@/components/CardNav";

const navItems: CardNavItem[] = [
  {
    label: "About",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Our Story", href: "/about", ariaLabel: "About StickModel" },
      {
        label: "How It Works",
        href: "/about",
        ariaLabel: "How our process works",
      },
    ],
  },
  {
    label: "Pricing",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      {
        label: "View Plans",
        href: "/pricing",
        ariaLabel: "View pricing plans",
      },
      {
        label: "FAQ",
        href: "/pricing",
        ariaLabel: "Frequently asked questions",
      },
    ],
  },
  {
    label: "Contact",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [
      { label: "Get in Touch", href: "/contact", ariaLabel: "Contact us" },
      {
        label: "Email Us",
        href: "mailto:hello@stickmodel.com",
        ariaLabel: "Email StickModel",
      },
    ],
  },
];

export function NavBar() {
  return (
    <CardNav
      logo="/horizontal.svg"
      logoAlt="stickmodel.com"
      items={navItems}
      baseColor="#ffffff"
      menuColor="#1e293b"
      buttonBgColor="#d83004"
      buttonTextColor="#ffffff"
      ctaLabel="Order Now"
      ctaHref="/login"
      ease="power3.out"
    />
  );
}
