"use client";

import Link from "next/link";
import { useState } from "react";
import SpecView from "@/components/SpecView";
import { TIMEFRAMES, type Spec, type Timeframe } from "@/lib/types";

const EXAMPLE = {
  title: "해커톤 직전 바이브코딩 특강",
  problem:
    "부원들이 바이브코딩을 처음 해 봐서 해커톤 첫 3시간을 도구 설정과 시행착오로 날린다",
  target: "해커톤 처음 나가는 신입 부원",
  timeframe: "해커톤 24시간" as Timeframe,
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

  function fillExample() {
    setTitle(EXAMPLE.title);
    setProblem(EXAMPLE.problem);
    setTarget(EXAMPLE.target);
    setTimeframe(EXAMPLE.timeframe);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !problem.trim()) {
      setError("행사 이름과 해결하려는 문제를 입력해 주세요.");
      return;
    }
    setError("");
    setSpec(null);
    setLoading(true);
    try {
      const res = await fetch("/api/specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, problem, target, timeframe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "알 수 없는 오류가 났습니다");
      } else {
        setSpec(data.spec);
      }
    } catch {
      setError("서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
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
        <button
          type="button"
          onClick={fillExample}
          className="text-sm text-accent underline"
        >
          예시 주제 채우기
        </button>
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
