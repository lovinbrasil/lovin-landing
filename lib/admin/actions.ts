"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { assertAdminResource } from "@/lib/admin/resources";
import { createAdminDataClient, createSupabaseServerClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value.length ? value : null;
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function redirectWithError(path: string, error: string): never {
  redirect(`${path}?error=${encodeURIComponent(error)}`);
}

export async function signInAction(formData: FormData) {
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const next = textValue(formData, "next") || "/admin";
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError("/admin/login", "E-mail ou senha inválidos, ou conta sem acesso.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithError("/admin/login", "Não foi possível confirmar seu acesso. Tente novamente.");
  }

  const { data: isAdmin } = await supabase.rpc("is_lovin_admin", {
    user_id: user.id,
  });

  if (!isAdmin) {
    await supabase.auth.signOut();
    redirectWithError("/admin/login", "Sua conta não tem autorização para acessar o painel.");
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateUserFlagAction(formData: FormData) {
  await getCurrentAdmin();
  const userId = textValue(formData, "user_id");
  const intent = textValue(formData, "intent");
  const client = await createAdminDataClient();
  const updates: Record<string, unknown> = {};

  if (intent === "activate") updates.is_active = true;
  if (intent === "deactivate") updates.is_active = false;
  if (intent === "verify") updates.is_verified = true;
  if (intent === "unverify") updates.is_verified = false;
  if (intent === "premium_on") {
    updates.is_premium = true;
    updates.premium_until = nullableText(formData, "premium_until");
  }
  if (intent === "premium_off") {
    updates.is_premium = false;
    updates.premium_until = null;
  }

  if (!userId || Object.keys(updates).length === 0) return;

  const { error } = await client.from("profiles").update(updates).eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function reviewIdentityAction(formData: FormData) {
  await getCurrentAdmin();
  const supabase = await createSupabaseServerClient();
  const verificationId = textValue(formData, "verification_id");
  const intent = textValue(formData, "intent");
  const returnTo = textValue(formData, "return_to");
  const resultStatus = intent === "approve" ? "approved" : "rejected";

  if (!verificationId) return;

  const result =
    intent === "approve"
      ? await supabase.rpc("approve_identity_verification", {
          verification_id: verificationId,
        })
      : await supabase.rpc("reject_identity_verification", {
          verification_id: verificationId,
          reason: textValue(formData, "reason") || "Documento não aprovado pela moderação.",
        });

  if (result.error) throw new Error(result.error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/approvals");
  revalidatePath(`/admin/approvals/${verificationId}`);
  revalidatePath("/admin/users");

  const destination = returnTo.startsWith("/admin/approvals")
    ? returnTo
    : `/admin/approvals/${verificationId}`;
  const separator = destination.includes("?") ? "&" : "?";

  redirect(`${destination}${separator}review=${resultStatus}`);
}

export async function upsertCommunityAction(formData: FormData) {
  await getCurrentAdmin();
  const client = await createAdminDataClient();
  const id = textValue(formData, "id");
  const payload = {
    name: textValue(formData, "name"),
    description: nullableText(formData, "description"),
    category: textValue(formData, "category") || "Geral",
    city: nullableText(formData, "city"),
    state: nullableText(formData, "state"),
    denomination: nullableText(formData, "denomination"),
    is_premium: checkboxValue(formData, "is_premium"),
  };

  const query = id
    ? client.from("communities").update(payload).eq("id", id)
    : client.from("communities").insert(payload);
  const { error } = await query;

  if (error) throw new Error(error.message);
  revalidatePath("/admin/communities");
  revalidatePath("/admin/data/communities");
}

export async function upsertEventAction(formData: FormData) {
  await getCurrentAdmin();
  const client = await createAdminDataClient();
  const id = textValue(formData, "id");
  const payload = {
    community_id: textValue(formData, "community_id"),
    title: textValue(formData, "title"),
    description: nullableText(formData, "description"),
    location_name: nullableText(formData, "location_name"),
    city: nullableText(formData, "city"),
    state: nullableText(formData, "state"),
    event_date: textValue(formData, "event_date"),
  };

  const query = id
    ? client.from("events").update(payload).eq("id", id)
    : client.from("events").insert(payload);
  const { error } = await query;

  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/admin/data/events");
}

export async function updateReportStatusAction(formData: FormData) {
  await getCurrentAdmin();
  const client = await createAdminDataClient();
  const reportId = textValue(formData, "report_id");
  const status = textValue(formData, "status");

  if (!reportId || !["pending", "reviewed", "resolved"].includes(status)) return;

  const { error } = await client.from("reports").update({ status }).eq("id", reportId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/data/reports");
}

export async function upsertJsonResourceAction(formData: FormData) {
  await getCurrentAdmin();
  const resource = assertAdminResource(textValue(formData, "resource"));
  const rawPayload = textValue(formData, "payload");
  const client = await createAdminDataClient();
  let payload: Record<string, unknown> | Array<Record<string, unknown>>;

  try {
    const parsed = JSON.parse(rawPayload) as unknown;
    const isRecord = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === "object" && !Array.isArray(value);

    if (Array.isArray(parsed)) {
      if (!parsed.every(isRecord)) throw new Error("invalid_array");
      payload = parsed;
    } else if (isRecord(parsed)) {
      payload = parsed;
    } else {
      throw new Error("invalid_payload");
    }
  } catch {
    redirectWithError(`/admin/data/${resource.key}`, "JSON inválido.");
  }

  const { error } = await client.from(resource.key).upsert(payload);
  if (error) {
    redirectWithError(`/admin/data/${resource.key}`, error.message);
  }

  revalidatePath(`/admin/data/${resource.key}`);
  redirect(`/admin/data/${resource.key}?saved=1`);
}

export async function deleteResourceRecordAction(formData: FormData) {
  await getCurrentAdmin();
  const resource = assertAdminResource(textValue(formData, "resource"));
  const id = textValue(formData, "id");
  const client = await createAdminDataClient();

  if (!id) return;

  const { error } = await client.from(resource.key).delete().eq(resource.idField, id);
  if (error) {
    redirectWithError(`/admin/data/${resource.key}`, error.message);
  }

  revalidatePath(`/admin/data/${resource.key}`);
  revalidatePath("/admin");
}
