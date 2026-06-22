import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";

import { signInAction } from "@/lib/admin/actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error;
  const next = params?.next ?? "/admin";

  return (
    <main className="admin-login">
      <Image
        src="/lovin-hero.png"
        alt=""
        fill
        sizes="100vw"
        className="admin-login-image"
        loading="eager"
        fetchPriority="high"
      />
      <div className="admin-login-panel">
        <div className="admin-login-brand">
          <span className="brand-mark" aria-hidden="true">
            L<span className="brand-heart">♥</span>
          </span>
          <div>
            <strong>Lovin Admin</strong>
            <span>Operação do app mobile</span>
          </div>
        </div>

        <div className="admin-login-copy">
          <p className="section-kicker">Acesso restrito</p>
          <h1>Entre para gerenciar o Lovin Brasil.</h1>
          <p>
            Use uma conta Supabase com <code>raw_app_meta_data.role</code> como
            <code> admin</code> ou <code> moderator</code>.
          </p>
        </div>

        {error ? <div className="form-error">{decodeURIComponent(error)}</div> : null}

        <form action={signInAction} className="admin-form">
          <input type="hidden" name="next" value={next} />
          <label>
            <span>E-mail</span>
            <div className="field-with-icon">
              <Mail size={18} aria-hidden="true" />
              <input name="email" type="email" autoComplete="email" required />
            </div>
          </label>
          <label>
            <span>Senha</span>
            <div className="field-with-icon">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>
          <button className="admin-primary-button" type="submit">
            Entrar no admin
          </button>
        </form>
      </div>
    </main>
  );
}
