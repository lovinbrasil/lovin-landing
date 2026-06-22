import Link from "next/link";

import { formatDate, formatStatus, getCount, getStatusClassName } from "@/lib/admin/data";
import { createAdminDataClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminEngagementPage() {
  const client = await createAdminDataClient();
  const [
    likes,
    superLikes,
    dislikes,
    matches,
    activeMatches,
    conversations,
    messages,
    recentMessagesResult,
    recentMatchesResult,
  ] = await Promise.all([
    getCount(client, "likes"),
    getCount(client, "likes", ["type", "super_like"]),
    getCount(client, "dislikes"),
    getCount(client, "matches"),
    getCount(client, "matches", ["status", "active"]),
    getCount(client, "conversations"),
    getCount(client, "messages"),
    client
      .from("messages")
      .select("id, conversation_id, sender_id, message_type, content, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    client
      .from("matches")
      .select("id, user_1_id, user_2_id, status, created_at, unmatched_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const metrics = [
    { label: "Likes", value: likes, href: "/admin/data/likes" },
    { label: "Super likes", value: superLikes, href: "/admin/data/likes" },
    { label: "Dislikes", value: dislikes, href: "/admin/data/dislikes" },
    { label: "Matches", value: matches, href: "/admin/data/matches" },
    { label: "Matches ativos", value: activeMatches, href: "/admin/data/matches" },
    { label: "Conversas", value: conversations, href: "/admin/data/conversations" },
    { label: "Mensagens", value: messages, href: "/admin/data/messages" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="section-kicker">Engajamento</p>
          <h1>Relacionamentos e conversa</h1>
          <p>Acompanhe o funil de descoberta, matches e atividade do chat.</p>
        </div>
      </div>

      <section className="admin-kpi-grid compact-kpis">
        {metrics.map((metric) => (
          <Link className="admin-kpi" href={metric.href} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>Abrir dados</small>
          </Link>
        ))}
      </section>

      <section className="admin-split-grid">
        <article className="admin-panel">
          <div className="panel-heading">
            <h2>Mensagens recentes</h2>
            <Link href="/admin/data/messages">Abrir tabela</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Conteúdo</th>
                  <th>Conversa</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                {(recentMessagesResult.data ?? []).map((message) => (
                  <tr key={message.id}>
                    <td>{message.message_type}</td>
                    <td>{message.content ?? "-"}</td>
                    <td>{message.conversation_id}</td>
                    <td>{formatDate(message.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <div className="panel-heading">
            <h2>Matches recentes</h2>
            <Link href="/admin/data/matches">Abrir tabela</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Usuários</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                {(recentMatchesResult.data ?? []).map((match) => (
                  <tr key={match.id}>
                    <td>
                      <span className={getStatusClassName(match.status)}>
                        {formatStatus(match.status)}
                      </span>
                    </td>
                    <td>
                      <small>{match.user_1_id}</small>
                      <small>{match.user_2_id}</small>
                    </td>
                    <td>{formatDate(match.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
