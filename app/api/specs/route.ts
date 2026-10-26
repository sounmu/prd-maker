import { generateSpec } from "@/lib/openai";
import { getSupabase } from "@/lib/supabase";
import { TIMEFRAMES, type SpecInput, type Timeframe } from "@/lib/types";

function fail(error: string, status: number) {
  return Response.json({ error }, { status });
}

// Supabase 에러는 Error가 아니라 { message, code } 모양의 일반 객체다.
function errMsg(e: unknown, fallback: string) {
  const m = (e as { message?: unknown } | null)?.message;
  return typeof m === "string" && m ? m : fallback;
}

// OpenAI가 준 에러를 사람이 읽을 수 있는 한 줄로 바꾼다. 키 값은 절대 넣지 않는다.
function aiErrorMessage(e: unknown) {
  const status = (e as { status?: number })?.status;
  if (status === 401) return "OpenAI 키가 올바르지 않습니다 (401). 키를 다시 복사해 주세요.";
  if (status === 404) return "OpenAI 모델을 찾을 수 없습니다 (404). OPENAI_MODEL을 확인해 주세요.";
  if (status === 400) return `OpenAI가 요청을 거부했습니다 (400): ${(e as Error).message}`;
  return e instanceof Error ? e.message : "AI 호출에 실패했습니다";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("요청 본문이 올바른 JSON이 아닙니다", 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const problem = typeof body.problem === "string" ? body.problem.trim() : "";
  const target = typeof body.target === "string" ? body.target.trim() : "";
  const timeframe: Timeframe = TIMEFRAMES.includes(body.timeframe as Timeframe)
    ? (body.timeframe as Timeframe)
    : "해커톤 24시간";

  if (title.length < 1 || title.length > 100) {
    return fail("행사 이름은 1~100자로 입력해 주세요", 400);
  }
  if (problem.length < 1 || problem.length > 1000) {
    return fail("해결하려는 문제는 1~1000자로 입력해 주세요", 400);
  }

  const input: SpecInput = { title, problem, target, timeframe };

  let spec;
  try {
    spec = await generateSpec(input);
  } catch (e) {
    return fail(aiErrorMessage(e), 502);
  }

  try {
    const { data, error } = await getSupabase()
      .from("specs")
      .insert({
        title,
        problem,
        target: target || null,
        timeframe,
        product_name: spec.product_name,
        spec,
      })
      .select("id, created_at")
      .single();
    if (error) throw error;
    return Response.json({ id: data.id, created_at: data.created_at, spec }, { status: 201 });
  } catch (e) {
    return fail(errMsg(e, "저장에 실패했습니다"), 500);
  }
}

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from("specs")
      .select("id, created_at, title, product_name, timeframe, one_liner:spec->>one_liner")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return Response.json({ items: data });
  } catch (e) {
    return fail(errMsg(e, "목록을 불러오지 못했습니다"), 500);
  }
}
