import Link from "next/link";
import { AlertTriangle, Home, LogOut, ShieldCheck } from "lucide-react";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { signOutAction } from "@/lib/admin/actions";
import { hasServiceRoleKey } from "@/lib/supabase/config";
import { AdminNav } from "./admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentAdmin();
  const hasServiceRole = hasServiceRoleKey();
  const adminEmail = user.email ?? "admin@lovin";
  const adminInitial = adminEmail.charAt(0).toUpperCase();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin" aria-label="Lovin Admin">
          <span className="brand-mark" aria-hidden="true">
            L<span className="brand-heart">♥</span>
          </span>
          <span>
            <strong>Lovin Admin</strong>
            <small>Gestão do app mobile</small>
          </span>
        </Link>

        <AdminNav />

        <form action={signOutAction} className="admin-logout">
          <button type="submit">
            <LogOut size={17} aria-hidden="true" />
            Sair
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span className="admin-overline">Console Lovin</span>
            <strong>Administração do app</strong>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-user-chip" aria-label="Usuário logado">
              <span className="admin-user-avatar" aria-hidden="true">
                {adminInitial}
              </span>
              <span className="admin-user-copy">
                <small>Administrador</small>
                <strong>{adminEmail}</strong>
              </span>
            </div>

            <span className="admin-role-pill">
              <ShieldCheck size={15} aria-hidden="true" />
              Admin
            </span>

            <Link className="admin-topbar-link" href="/" target="_blank" rel="noreferrer">
              <Home size={16} aria-hidden="true" />
              <span>Landing</span>
            </Link>

            <form action={signOutAction} className="admin-topbar-logout">
              <button type="submit" aria-label="Sair da conta">
                <LogOut size={16} aria-hidden="true" />
                <span>Sair</span>
              </button>
            </form>
          </div>
        </header>

        {!hasServiceRole ? (
          <div className="admin-warning">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              Configure <code>SUPABASE_SERVICE_ROLE_KEY</code> no servidor para
              liberar leitura e CRUD completos em todas as tabelas com RLS.
            </span>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
