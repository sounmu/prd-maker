"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SpecView from "@/components/SpecView";
import type { SpecRow } from "@/lib/types";

export default function SpecDetail({ id }: { id: string }) {
  const router = useRouter();
  const [item, setItem] = useState<SpecRow | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/specs/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "불러오지 못했습니다");
        setItem(data.item);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  async function handleDelete() {
    if (!confirm("이 PRD를 삭제할까요?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/specs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "삭제하지 못했습니다");
      }
      router.push("/specs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제하지 못했습니다");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <Link href="/specs" className="text-sm text-accent underline">
          내 PRD 목록
        </Link>
        {item && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 disabled:opacity-60"
          >
            {deleting ? "삭제 중..." : "삭제"}
          </button>
        )}
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!error && !item && <p className="text-muted">불러오는 중...</p>}
      {item && <SpecView spec={item.spec} />}
    </div>
  );
}
