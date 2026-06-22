import Link from "next/link";
import { ArrowRight, ShieldCheck, Siren, Sparkles, UsersRound } from "lucide-react";

import {
  formatDate,
  formatStatus,
  getDashboardStats,
  getStatusClassName,
} from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const client = await createAdminDataClient();
  const stats = await getDashboardStats();
  const [{ data: recentUsers }, { data: approvals }, { data: reports }] =
    await Promise.all([
      client
        .from("profiles")
        .select("id, full_name, city, state, is_active, is_verified, is_premium, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      client
        .from("identity_verifications")
        .select("id, legal_full_name, status, submitted_at")
        .order("submitted_at", { ascending: false })
        .limit(5),
      client
        .from("reports")
        .select("id, reason, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const kpis = [
    { label: "Usuários", value: stats.users, note: `${stats.activeUsers} ativos`, Icon: UsersRound },
    { label: "Verificados", value: stats.verifiedUsers, note: `${stats.pendingApprovals} pendentes`, Icon: ShieldCheck },
    { label: "Premium", value: stats.premiumUsers, note: "assinantes ativos", Icon: Sparkles },
    { label: "Denúncias", value: stats.reports, note: `${stats.pendingReports} pendentes`, Icon: Siren },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Dashboard</p>
          <h1>Visão geral do Lovin Brasil</h1>
          <p>
            Indicadores operacionais para acompanhar aquisição, verificação,
            moderação e engajamento do aplicativo mobile.
          </p>
        </div>
      </div>

      <section className="admin-kpi-grid" aria-label="Indicadores principais">
        {kpis.map(({ label, value, note, Icon }) => (
          <article className="admin-kpi" key={label}>
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="admin-split-grid">
        <article className="admin-panel">
          <div className="panel-heading">
            <h2>Usuários recentes</h2>
            <Link href="/admin/users">
              Ver todos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="admin-list">
            {(recentUsers ?? []).map((user) => (
              <div className="admin-list-row" key={user.id}>
                <div>
                  <strong>{user.full_name}</strong>
                  <span>
                    {user.city ?? "Cidade não informada"}
                    {user.state ? `, ${user.state}` : ""}
                  </span>
                </div>
                <div className="status-cluster">
                  <span className={user.is_active ? "status-good" : "status-danger"}>
                    {user.is_active ? "ativo" : "inativo"}
                  </span>
                  <span className={user.is_verified ? "status-good" : "status-muted"}>
                    {user.is_verified ? "verificado" : "não verificado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="panel-heading">
            <h2>Fila de aprovação</h2>
            <Link href="/admin/approvals">
              Revisar <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="admin-list">
            {(approvals ?? []).map((approval) => (
              <div className="admin-list-row" key={approval.id}>
                <div>
                  <strong>{approval.legal_full_name}</strong>
                  <span>{formatDate(approval.submitted_at)}</span>
                </div>
                <span className={getStatusClassName(approval.status)}>
                  {formatStatus(approval.status)}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <h2>Moderação recente</h2>
          <Link href="/admin/reports">
            Abrir moderação <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Status</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {(reports ?? []).map((report) => (
                <tr key={report.id}>
                  <td>{report.reason}</td>
                  <td>
                    <span className={getStatusClassName(report.status)}>
                      {formatStatus(report.status)}
                    </span>
                  </td>
                  <td>{formatDate(report.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
