import { createClient } from "@/lib/supabase/client";

export interface RoleCheck {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string | null;
}

let cachedRole: RoleCheck | null = null;
let cacheTime = 0;

export async function checkUserRole(): Promise<RoleCheck> {
  if (cachedRole && Date.now() - cacheTime < 120000) {
    return cachedRole;
  }

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("admin_users")
      .select("role")
      .single();

    const result: RoleCheck = {
      isAdmin: !!data,
      isSuperAdmin: data?.role === "super_admin",
      role: data?.role || null,
    };

    cachedRole = result;
    cacheTime = Date.now();
    return result;
  } catch {
    return { isAdmin: false, isSuperAdmin: false, role: null };
  }
}
