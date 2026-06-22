"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavItems } from "@/lib/admin/navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href.startsWith("/admin/data")) return pathname.startsWith("/admin/data");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Navegação administrativa">
      {adminNavItems.map(({ href, label, Icon }) => {
        const active = isActivePath(pathname, href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={active ? "active" : undefined}
            href={href}
            key={href}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
