import type { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

function fail(error: string, status: number) {
  return Response.json({ error }, { status });
}

// Supabase 에러는 Error가 아니라 { message, code } 모양의 일반 객체다.
function errMsg(e: unknown, fallback: string) {
  const m = (e as { message?: unknown } | null)?.message;
  return typeof m === "string" && m ? m : fallback;
}

// id가 uuid 모양이 아니면 Postgres가 22P02 에러를 낸다. 없는 것과 같이 404로 돌려준다.
const INVALID_UUID = "22P02";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/specs/[id]">) {
  const { id } = await ctx.params;
  try {
    const { data, error } = await getSupabase()
      .from("specs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error && error.code !== INVALID_UUID) throw error;
    if (!data) return fail("해당 PRD를 찾을 수 없습니다", 404);
    return Response.json({ item: data });
  } catch (e) {
    return fail(errMsg(e, "불러오지 못했습니다"), 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/specs/[id]">) {
  const { id } = await ctx.params;
  try {
    const { data, error } = await getSupabase()
      .from("specs")
      .delete()
      .eq("id", id)
      .select("id");
    if (error && error.code !== INVALID_UUID) throw error;
    if (!data || data.length === 0) return fail("해당 PRD를 찾을 수 없습니다", 404);
    return new Response(null, { status: 204 });
  } catch (e) {
    return fail(errMsg(e, "삭제하지 못했습니다"), 500);
  }
}
