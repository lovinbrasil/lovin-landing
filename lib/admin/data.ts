import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminDataClient } from "@/lib/supabase/server";
import { assertAdminResource, adminResources } from "./resources";

export type AdminRow = Record<string, unknown>;

const statusLabels: Record<string, string> = {
  active: "Ativo",
  approved: "Aprovado",
  blocked: "Bloqueado",
  cancelled: "Cancelado",
  canceled: "Cancelado",
  inactive: "Inativo",
  pending: "Pendente",
  rejected: "Rejeitado",
  resolved: "Resolvido",
  reviewed: "Revisado",
  unmatched: "Desfeito",
};

export function formatDate(value: unknown) {
  if (!value || typeof value !== "string") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatStatus(value: unknown) {
  if (!value || typeof value !== "string") return "-";
  return statusLabels[value] ?? value;
}

export function getStatusClassName(value: unknown) {
  if (value === "pending") return "status-warn";
  if (["rejected", "inactive", "blocked", "cancelled", "canceled"].includes(String(value))) {
    return "status-danger";
  }
  if (["reviewed", "unmatched"].includes(String(value))) return "status-muted";
  if (["approved", "active", "resolved"].includes(String(value))) return "status-good";
  return "status-muted";
}

export function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return formatDate(value);
  }
  if (typeof value === "string" && value in statusLabels) return formatStatus(value);
  return String(value);
}

export async function getCount(
  client: SupabaseClient,
  table: string,
  eq?: readonly [column: string, value: string | boolean],
) {
  let query = client.from(table).select("*", { count: "exact", head: true });
  if (eq) query = query.eq(eq[0], eq[1]);
  const { count, error } = await query;
  if (error) return 0;
  return count ?? 0;
}

export async function getDashboardStats() {
  const client = await createAdminDataClient();
  const [
    users,
    activeUsers,
    verifiedUsers,
    premiumUsers,
    pendingApprovals,
    reports,
    pendingReports,
    communities,
    events,
    matches,
    messages,
  ] = await Promise.all([
    getCount(client, "profiles"),
    getCount(client, "profiles", ["is_active", true]),
    getCount(client, "profiles", ["is_verified", true]),
    getCount(client, "profiles", ["is_premium", true]),
    getCount(client, "identity_verifications", ["status", "pending"]),
    getCount(client, "reports"),
    getCount(client, "reports", ["status", "pending"]),
    getCount(client, "communities"),
    getCount(client, "events"),
    getCount(client, "matches"),
    getCount(client, "messages"),
  ]);

  return {
    users,
    activeUsers,
    verifiedUsers,
    premiumUsers,
    pendingApprovals,
    reports,
    pendingReports,
    communities,
    events,
    matches,
    messages,
  };
}

export async function listResourceRows(resourceKey: string, limit = 40) {
  const resource = assertAdminResource(resourceKey);
  const client = await createAdminDataClient();
  let query = client.from(resource.key).select("*").limit(limit);

  if (resource.orderBy) {
    query = query.order(resource.orderBy, { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as AdminRow[];
}

export function getResourcePayloadTemplate(resourceKey: string) {
  const resource = assertAdminResource(resourceKey);
  const base = Object.fromEntries(resource.columns.map((column) => [column, ""]));
  delete base.created_at;
  delete base.updated_at;
  delete base.submitted_at;
  delete base.reviewed_at;
  return JSON.stringify(base, null, 2);
}

export function getOperationalResources() {
  return adminResources;
}
