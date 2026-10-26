import "server-only";
import OpenAI from "openai";
import { specSchema } from "@/lib/spec-schema";
import type { Spec, SpecInput } from "@/lib/types";

// 클라이언트는 함수 안에서 만든다. 환경변수가 없어도 빌드가 터지지 않게.
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 .env.local에 없습니다");
  }
  return new OpenAI({ apiKey });
}

const INSTRUCTIONS = `너는 동아리 회장 겸 행사 베테랑이다. 동아리 행사를 여러 번 직접 치러 봤고, 참석률, 예산, 준비물 같은 현실적인 부분을 가장 먼저 챙긴다. 범위는 현실적으로 줄여 준다.
사용자가 동아리 행사 주제를 주면, 운영진이 바로 쓸 수 있는 행사 기획안을 JSON으로 만든다. 모든 문장은 한국어로 쓴다.

필드별 규칙:
- product_name: 행사 이름. one_liner: 행사를 한 줄로 소개.
- problem: 이 행사가 해결하려는 문제.
- target_users: 참가자와 운영진 중심으로 2명 내외. persona는 누구인지, pain은 무엇이 불편한지.
- core_features: 행사 구성 요소 4~6개. priority는 P0 또는 P1이고 P0는 최대 3개.
- user_flow: 참가자가 신청부터 후기까지 거치는 4~6단계.
- screens: 신청, 안내 등에 쓰는 화면이나 자료 2~4개.
- data_model: 행사 신청이나 출석을 관리하는 작은 웹 도구가 있다고 가정하고 테이블 1~3개. columns의 각 항목은 "이름 타입" 형식(예: "name text").
- api_endpoints: 위 웹 도구의 API 2~5개.
- out_of_scope: 일부러 이번에 안 하는 것.
- risks: 참석률, 예산, 장소, 준비 부족 같은 현실적인 위험 2~3개.
- checklist: 준비물·역할 분담 체크리스트 6~10개. task는 해야 할 일이나 준비물, owner는 맡을 역할(예: 회장, 총무, 홍보).
- first_prompt: Claude Code나 Codex에 그대로 붙여 넣어 위 웹 도구의 첫 화면을 만들게 할 첫 프롬프트. 아주 작은 범위부터 시작하게 쓴다.`;

export async function generateSpec(input: SpecInput): Promise<Spec> {
  const client = getOpenAI();

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-6-luna",
    instructions: INSTRUCTIONS,
    input: [
      `행사 이름: ${input.title}`,
      `해결하려는 문제: ${input.problem}`,
      `타깃 유저: ${input.target || "(없음)"}`,
      `개발 기간: ${input.timeframe}`,
    ].join("\n"),
    text: {
      format: {
        type: "json_schema",
        name: "prd",
        strict: true,
        schema: specSchema,
      },
    },
  });

  return JSON.parse(response.output_text) as Spec;
}
