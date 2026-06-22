import { updateReportStatusAction, updateUserFlagAction } from "@/lib/admin/actions";
import { formatDate, formatStatus, getStatusClassName } from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function relationField(value: unknown, field: string) {
  if (Array.isArray(value)) return relationField(value[0], field);
  if (value && typeof value === "object" && field in value) {
    const fieldValue = (value as Record<string, unknown>)[field];
    return typeof fieldValue === "string" || typeof fieldValue === "boolean" ? fieldValue : null;
  }
  return null;
}

export default async function AdminReportsPage() {
  const client = await createAdminDataClient();
  const { data: reports, error } = await client
    .from("reports")
    .select(
      "id, reporter_id, reported_user_id, reason, description, status, created_at, reporter:profiles!reports_reporter_id_fkey(full_name), reported:profiles!reports_reported_user_id_fkey(full_name, is_active)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Moderação</p>
          <h1>Denúncias e segurança</h1>
          <p>Revise reports, acompanhe reincidências e pause contas quando necessário.</p>
        </div>
      </div>

      {error ? <div className="form-error">{error.message}</div> : null}

      <section className="admin-grid-list">
        {(reports ?? []).map((report) => (
          <article className="report-card" key={report.id}>
            <div className="approval-card-header">
              <div>
                <span className={getStatusClassName(report.status)}>
                  {formatStatus(report.status)}
                </span>
                <h2>{report.reason}</h2>
                <p>{formatDate(report.created_at)}</p>
              </div>
            </div>

            <dl className="admin-definition-grid">
              <div>
                <dt>Reportou</dt>
                <dd>{relationField(report.reporter, "full_name") ?? report.reporter_id}</dd>
              </div>
              <div>
                <dt>Denunciado</dt>
                <dd>{relationField(report.reported, "full_name") ?? report.reported_user_id}</dd>
              </div>
              <div>
                <dt>Descrição</dt>
                <dd>{report.description ?? "-"}</dd>
              </div>
              <div>
                <dt>Status da conta</dt>
                <dd>{relationField(report.reported, "is_active") ? "ativa" : "inativa"}</dd>
              </div>
            </dl>

            <div className="row-actions horizontal-actions">
              {["pending", "reviewed", "resolved"].map((status) => (
                <form action={updateReportStatusAction} key={status}>
                  <input type="hidden" name="report_id" value={report.id} />
                  <input type="hidden" name="status" value={status} />
                  <button type="submit">{formatStatus(status)}</button>
                </form>
              ))}
              <form action={updateUserFlagAction}>
                <input type="hidden" name="user_id" value={report.reported_user_id} />
                <input type="hidden" name="intent" value="deactivate" />
                <button type="submit">Pausar denunciado</button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
