"use client";

import Link from "next/link";
import { useState } from "react";
import SpecView from "@/components/SpecView";
import { TIMEFRAMES, type Spec, type Timeframe } from "@/lib/types";

// Step 2에서 지우고 fetch("/api/specs")로 바꾼다.
const MOCK_SPEC: Spec = {
  product_name: "해커톤 직전 바이브코딩 특강",
  one_liner: "해커톤 전날, 부원들이 AI와 함께 첫 화면을 띄워 보는 2시간 특강",
  problem:
    "해커톤을 앞두고 바이브코딩을 해 본 적 없는 부원이 많아서, 대회 당일 첫 3시간을 도구 설정과 시행착오로 날린다.",
  target_users: [
    { persona: "해커톤 처음 나가는 부원", pain: "AI에게 무엇을 어떤 순서로 시켜야 할지 모른다" },
    { persona: "행사를 맡은 운영진", pain: "참석률과 준비물을 혼자 챙기느라 기획이 늘어진다" },
  ],
  core_features: [
    { name: "사전 신청 폼", description: "참석 인원과 노트북 지참 여부를 미리 받는다", priority: "P0" },
    { name: "실습 3단계 커리큘럼", description: "PRD 쓰기 → 화면 만들기 → 배포까지 한 흐름으로 따라 한다", priority: "P0" },
    { name: "당일 출석 체크", description: "입장할 때 이름만 찍으면 끝나는 간단한 출석", priority: "P1" },
    { name: "후기 수집", description: "끝나고 막힌 지점을 한 줄씩 받는다", priority: "P1" },
  ],
  user_flow: [
    "운영진이 특강 공지와 신청 링크를 올린다",
    "부원이 신청 폼을 작성한다",
    "행사 당일 입장하며 출석을 체크한다",
    "3단계 실습을 따라 하며 첫 화면을 띄운다",
    "마무리 후 막힌 점을 한 줄 후기로 남긴다",
  ],
  screens: [
    { name: "신청 폼", purpose: "이름, 학번, 노트북 지참 여부 입력" },
    { name: "당일 안내", purpose: "시간표와 실습 순서 확인" },
  ],
  data_model: [
    { table: "signups", columns: ["id uuid", "name text", "has_laptop boolean", "created_at timestamptz"] },
  ],
  api_endpoints: [
    { method: "POST", path: "/api/signups", description: "신청 저장" },
    { method: "GET", path: "/api/signups", description: "신청 목록 조회" },
  ],
  out_of_scope: ["결제 / 참가비 정산", "실시간 질의응답 채팅", "녹화 영상 업로드"],
  risks: [
    "노트북이나 와이파이 문제로 실습이 시작 전에 막힌다",
    "참석 인원이 예상보다 적거나 많아 자리와 간식이 어긋난다",
  ],
  first_prompt:
    "Next.js + Tailwind로 특강 신청 폼 한 화면을 만들어 줘. 이름, 학번, 노트북 지참 여부 3개 입력과 제출 버튼만 있으면 돼. 아직 DB는 연결하지 말고 제출하면 화면에 '신청 완료'만 보여 줘.",
};

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-accent";

export default function Home() {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [target, setTarget] = useState("");
  const [timeframe, setTimeframe] = useState<Timeframe>("해커톤 24시간");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spec, setSpec] = useState<Spec | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !problem.trim()) {
      setError("행사 이름과 해결하려는 문제를 입력해 주세요.");
      return;
    }
    setError("");
    setSpec(null);
    setLoading(true);
    setTimeout(() => {
      setSpec(MOCK_SPEC);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl font-bold">행사 기획안 메이커</h1>
          <p className="text-sm text-muted">
            아이디어 한 줄로 동아리 행사 기획안 만들기
          </p>
        </div>
        <Link href="/specs" className="shrink-0 text-sm text-accent underline">
          내 PRD 목록
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">행사 이름</span>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 해커톤 직전 바이브코딩 특강"
            maxLength={100}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">해결하려는 문제</span>
          <textarea
            className={inputClass}
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="예: 부원들이 바이브코딩을 처음 해 봐서 해커톤 첫 3시간을 날린다"
            maxLength={1000}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">
            타깃 유저 <span className="font-normal text-muted">(선택)</span>
          </span>
          <input
            className={inputClass}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="예: 해커톤 처음 나가는 신입 부원"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">개발 기간</span>
          <select
            className={inputClass}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
          >
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-card disabled:opacity-60"
        >
          {loading ? "PRD 작성 중... (10~30초)" : "PRD 만들기"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {spec && (
        <div className="mt-8">
          <SpecView spec={spec} />
        </div>
      )}
    </div>
  );
}
