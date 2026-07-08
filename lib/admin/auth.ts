import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSession = {
  user: User;
};

export async function getCurrentAdmin(): Promise<AdminSession> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error } = await supabase.rpc("is_lovin_admin", {
    user_id: user.id,
  });

  if (error || !isAdmin) {
    await supabase.auth.signOut();
    const accessError = encodeURIComponent(
      "Sua conta não tem autorização para acessar o painel.",
    );
    redirect(`/admin/login?error=${accessError}`);
  }

  return { user };
}
