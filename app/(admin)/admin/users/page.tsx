import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { updateUserFlagAction } from "@/lib/admin/actions";
import { formatDate } from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

type UsersPageProps = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    status?: string;
    verified?: string;
    premium?: string;
    completed?: string;
    city?: string;
    state?: string;
    from?: string;
    to?: string;
  }>;
};

export const dynamic = "force-dynamic";

const pageSize = 40;

function numberParam(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function choiceParam(value: string | undefined, allowed: string[]) {
  return value && allowed.includes(value) ? value : "all";
}

function dateParam(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function searchText(value?: string) {
  return (value ?? "").replaceAll(",", " ").replaceAll("%", " ").trim();
}

function pageHref(page: number, filters: Record<string, string>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = numberParam(params?.page);
  const q = searchText(params?.q);
  const city = searchText(params?.city);
  const state = searchText(params?.state).toUpperCase();
  const status = choiceParam(params?.status, ["active", "inactive"]);
  const verified = choiceParam(params?.verified, ["verified", "unverified"]);
  const premium = choiceParam(params?.premium, ["premium", "free"]);
  const completed = choiceParam(params?.completed, ["complete", "incomplete"]);
  const from = dateParam(params?.from);
  const to = dateParam(params?.to);
  const filters = {
    q,
    status: status === "all" ? "" : status,
    verified: verified === "all" ? "" : verified,
    premium: premium === "all" ? "" : premium,
    completed: completed === "all" ? "" : completed,
    city,
    state,
    from,
    to,
  };
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const client = await createAdminDataClient();
  let query = client
    .from("profiles")
    .select(
      "id, full_name, city, state, denomination, purpose, is_active, is_verified, is_premium, premium_until, profile_completed, created_at",
      { count: "exact" },
    );

  if (q) {
    const filtersOr = [
      `full_name.ilike.%${q}%`,
      `city.ilike.%${q}%`,
      `state.ilike.%${q}%`,
      `denomination.ilike.%${q}%`,
      `purpose.ilike.%${q}%`,
    ];

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q)) {
      filtersOr.push(`id.eq.${q}`);
    }

    query = query.or(filtersOr.join(","));
  }

  if (city) query = query.ilike("city", `%${city}%`);
  if (state) query = query.ilike("state", state);
  if (status !== "all") query = query.eq("is_active", status === "active");
  if (verified !== "all") query = query.eq("is_verified", verified === "verified");
  if (premium !== "all") query = query.eq("is_premium", premium === "premium");
  if (completed !== "all") {
    query = query.eq("profile_completed", completed === "complete");
  }
  if (from) query = query.gte("created_at", `${from}T00:00:00.000Z`);
  if (to) query = query.lte("created_at", `${to}T23:59:59.999Z`);

  const { data: users, error, count } = await query
    .order("created_at", { ascending: false })
    .range(start, end);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Usuários</p>
          <h1>Gestão de perfis</h1>
          <p>Ative, pause, verifique e gerencie acesso premium dos usuários.</p>
        </div>
      </div>

      <form className="admin-filter-bar user-filter-bar" action="/admin/users">
        <label>
          <span>Busca</span>
          <input
            name="q"
            placeholder="Nome, ID, cidade, denominação ou propósito"
            defaultValue={q}
          />
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={status}>
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </label>
        <label>
          <span>Verificação</span>
          <select name="verified" defaultValue={verified}>
            <option value="all">Todos</option>
            <option value="verified">Verificados</option>
            <option value="unverified">Pendentes</option>
          </select>
        </label>
        <label>
          <span>Premium</span>
          <select name="premium" defaultValue={premium}>
            <option value="all">Todos</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>
        </label>
        <label>
          <span>Perfil</span>
          <select name="completed" defaultValue={completed}>
            <option value="all">Todos</option>
            <option value="complete">Completos</option>
            <option value="incomplete">Incompletos</option>
          </select>
        </label>
        <label>
          <span>Cidade</span>
          <input name="city" placeholder="São Paulo" defaultValue={city} />
        </label>
        <label>
          <span>UF</span>
          <input name="state" placeholder="SP" maxLength={2} defaultValue={state} />
        </label>
        <label>
          <span>Criado de</span>
          <input name="from" type="date" defaultValue={from} />
        </label>
        <label>
          <span>Criado até</span>
          <input name="to" type="date" defaultValue={to} />
        </label>
        <div className="filter-actions">
          <button type="submit">Filtrar</button>
          <Link href="/admin/users">Limpar</Link>
        </div>
      </form>

      {error ? <div className="form-error">{error.message}</div> : null}

      <div className="approval-list-summary">
        <span>{total} usuários encontrados</span>
        <strong>
          Página {Math.min(page, totalPages)} de {totalPages}
        </strong>
      </div>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Local</th>
                <th>Propósito</th>
                <th>Status</th>
                <th>Premium</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.full_name}</strong>
                    <small>{user.id}</small>
                  </td>
                  <td>
                    {user.city ?? "-"}
                    {user.state ? `, ${user.state}` : ""}
                    <small>{user.denomination ?? "Denominação não informada"}</small>
                  </td>
                  <td>{user.purpose ?? "-"}</td>
                  <td>
                    <div className="status-stack">
                      <span className={user.is_active ? "status-good" : "status-danger"}>
                        {user.is_active ? "ativo" : "inativo"}
                      </span>
                      <span className={user.is_verified ? "status-good" : "status-muted"}>
                        {user.is_verified ? "verificado" : "pendente"}
                      </span>
                      <span className={user.profile_completed ? "status-good" : "status-muted"}>
                        {user.profile_completed ? "completo" : "incompleto"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={user.is_premium ? "status-premium" : "status-muted"}>
                      {user.is_premium ? "premium" : "free"}
                    </span>
                    <small>{user.premium_until ? formatDate(user.premium_until) : "-"}</small>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="row-actions">
                      <form action={updateUserFlagAction}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <input
                          type="hidden"
                          name="intent"
                          value={user.is_active ? "deactivate" : "activate"}
                        />
                        <button type="submit">{user.is_active ? "Pausar" : "Ativar"}</button>
                      </form>
                      <form action={updateUserFlagAction}>
                        <input type="hidden" name="user_id" value={user.id} />
                        <input
                          type="hidden"
                          name="intent"
                          value={user.is_verified ? "unverify" : "verify"}
                        />
                        <button type="submit">
                          {user.is_verified ? "Remover verificação" : "Verificar"}
                        </button>
                      </form>
                      <form action={updateUserFlagAction} className="inline-premium-form">
                        <input type="hidden" name="user_id" value={user.id} />
                        <input
                          type="hidden"
                          name="intent"
                          value={user.is_premium ? "premium_off" : "premium_on"}
                        />
                        {!user.is_premium ? (
                          <input
                            name="premium_until"
                            type="datetime-local"
                            aria-label="Premium até"
                          />
                        ) : null}
                        <button type="submit">
                          {user.is_premium ? "Remover premium" : "Dar premium"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {!error && users?.length === 0 ? (
        <div className="admin-empty-state">Nenhum usuário encontrado com esses filtros.</div>
      ) : null}

      <nav className="pagination-controls" aria-label="Paginação de usuários">
        {page > 1 ? (
          <Link href={pageHref(page - 1, filters)}>
            <ChevronLeft size={16} aria-hidden="true" />
            Anterior
          </Link>
        ) : (
          <span aria-disabled="true">
            <ChevronLeft size={16} aria-hidden="true" />
            Anterior
          </span>
        )}

        <strong>
          {Math.min(page, totalPages)} / {totalPages}
        </strong>

        {page < totalPages ? (
          <Link href={pageHref(page + 1, filters)}>
            Próxima
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <span aria-disabled="true">
            Próxima
            <ChevronRight size={16} aria-hidden="true" />
          </span>
        )}
      </nav>
    </div>
  );
}
