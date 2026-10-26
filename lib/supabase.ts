import "server-only";
import { createClient } from "@supabase/supabase-js";

// secret 키는 RLS를 우회한다. 서버에서만 쓰고 브라우저로 보내지 않는다.
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL 또는 SUPABASE_SECRET_KEY가 .env.local에 없습니다");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
