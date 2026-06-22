import {
  BarChart3,
  CalendarDays,
  Database,
  HeartHandshake,
  ShieldCheck,
  Siren,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", Icon: BarChart3 },
  { href: "/admin/users", label: "Usuários", Icon: UsersRound },
  { href: "/admin/approvals", label: "Aprovações", Icon: ShieldCheck },
  { href: "/admin/communities", label: "Comunidades", Icon: HeartHandshake },
  { href: "/admin/events", label: "Eventos", Icon: CalendarDays },
  { href: "/admin/reports", label: "Moderação", Icon: Siren },
  { href: "/admin/engagement", label: "Engajamento", Icon: BarChart3 },
  { href: "/admin/data/profiles", label: "Dados", Icon: Database },
];
