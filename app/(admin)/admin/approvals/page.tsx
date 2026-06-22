import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, FileCheck2 } from "lucide-react";

import {
  formatDate,
  formatStatus,
  getStatusClassName,
} from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

type ApprovalsPageProps = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    status?: string;
    document?: string;
    from?: string;
    to?: string;
  }>;
};

export const dynamic = "force-dynamic";

const pageSize = 12;

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

function pageHref(page: number, filters: Record<string, string>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/admin/approvals?${query}` : "/admin/approvals";
}

function relationField(value: unknown, field: string) {
  if (Array.isArray(value)) return relationField(value[0], field);
  if (value && typeof value === "object" && field in value) {
    const fieldValue = (value as Record<string, unknown>)[field];
    return typeof fieldValue === "string" || typeof fieldValue === "boolean" ? fieldValue : null;
  }
  return null;
}

export default async function AdminApprovalsPage({ searchParams }: ApprovalsPageProps) {
  const params = await searchParams;
  const page = numberParam(params?.page);
  const q = (params?.q ?? "").trim();
  const status = choiceParam(params?.status, ["pending", "approved", "rejected"]);
  const documentType = choiceParam(params?.document, ["rg", "cnh", "passport"]);
  const from = dateParam(params?.from);
  const to = dateParam(params?.to);
  const filters = {
    q,
    status: status === "all" ? "" : status,
    document: documentType === "all" ? "" : documentType,
    from,
    to,
  };
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const client = await createAdminDataClient();
  let query = client
    .from("identity_verifications")
    .select(
      "id, user_id, status, document_type, document_last4, legal_full_name, birth_date, rejection_reason, submitted_at, reviewed_at, profiles(full_name, city, state, is_verified)",
      { count: "exact" },
    );

  if (status !== "all") query = query.eq("status", status);
  if (documentType !== "all") query = query.eq("document_type", documentType);
  if (from) query = query.gte("submitted_at", `${from}T00:00:00.000Z`);
  if (to) query = query.lte("submitted_at", `${to}T23:59:59.999Z`);
  if (q) {
    const term = q.replaceAll(",", " ").replaceAll("%", " ").trim();
    if (term) {
      query = query.or(`legal_full_name.ilike.%${term}%,document_last4.ilike.%${term}%`);
    }
  }

  const { data: approvals, error, count } = await query
    .order("submitted_at", { ascending: false })
    .range(start, end);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Aprovações</p>
          <h1>Verificação de identidade</h1>
          <p>Revise documentos, selfie e consistência dos dados enviados.</p>
        </div>
      </div>

      <form className="admin-filter-bar" action="/admin/approvals">
        <label>
          <span>Busca</span>
          <input
            name="q"
            placeholder="Nome ou final do documento"
            defaultValue={q}
          />
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={status}>
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovadas</option>
            <option value="rejected">Rejeitadas</option>
          </select>
        </label>
        <label>
          <span>Documento</span>
          <select name="document" defaultValue={documentType}>
            <option value="all">Todos</option>
            <option value="rg">RG</option>
            <option value="cnh">CNH</option>
            <option value="passport">Passaporte</option>
          </select>
        </label>
        <label>
          <span>Enviado de</span>
          <input name="from" type="date" defaultValue={from} />
        </label>
        <label>
          <span>Enviado até</span>
          <input name="to" type="date" defaultValue={to} />
        </label>
        <div className="filter-actions">
          <button type="submit">Filtrar</button>
          <Link href="/admin/approvals">Limpar</Link>
        </div>
      </form>

      {error ? <div className="form-error">{error.message}</div> : null}

      <div className="approval-list-summary">
        <span>{total} solicitações encontradas</span>
        <strong>
          Página {Math.min(page, totalPages)} de {totalPages}
        </strong>
      </div>

      <section className="approval-card-grid" aria-label="Solicitações de aprovação">
        {(approvals ?? []).map((approval) => {
          const fullName =
            relationField(approval.profiles, "full_name") ?? approval.legal_full_name;
          const city = relationField(approval.profiles, "city");
          const state = relationField(approval.profiles, "state");

          return (
            <Link
              className="approval-list-card"
              href={`/admin/approvals/${approval.id}`}
              key={approval.id}
            >
              <div className="approval-list-card-top">
                <span className={getStatusClassName(approval.status)}>
                  {formatStatus(approval.status)}
                </span>
                <small>{formatDate(approval.submitted_at)}</small>
              </div>
              <div>
                <h2>{approval.legal_full_name}</h2>
                <p>
                  {approval.document_type.toUpperCase()} final{" "}
                  {approval.document_last4 ?? "----"}
                </p>
              </div>
              <dl className="approval-list-meta">
                <div>
                  <dt>Feito por</dt>
                  <dd>{fullName}</dd>
                </div>
                <div>
                  <dt>Nascimento</dt>
                  <dd>{approval.birth_date}</dd>
                </div>
                <div>
                  <dt>Local</dt>
                  <dd>
                    {city ?? "Não informado"}
                    {state ? `, ${state}` : ""}
                  </dd>
                </div>
                <div>
                  <dt>Revisado em</dt>
                  <dd>{approval.reviewed_at ? formatDate(approval.reviewed_at) : "-"}</dd>
                </div>
              </dl>
              <span className="approval-card-action">
                <FileCheck2 size={16} aria-hidden="true" />
                Abrir detalhes
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>

      {!error && approvals?.length === 0 ? (
        <div className="admin-empty-state">Nenhuma solicitação encontrada nesta página.</div>
      ) : null}

      <nav className="pagination-controls" aria-label="Paginação de aprovações">
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
