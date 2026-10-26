"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SpecListItem } from "@/lib/types";

export default function SpecsPage() {
  const [items, setItems] = useState<SpecListItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/specs")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "목록을 불러오지 못했습니다");
        setItems(data.items);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <h1 className="font-serif text-xl font-bold">내 PRD 목록</h1>
        <Link href="/" className="shrink-0 text-sm text-accent underline">
          새로 만들기
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && items === null && <p className="text-muted">불러오는 중...</p>}

      {items && items.length === 0 && (
        <p className="text-muted">
          아직 만든 PRD가 없다.{" "}
          <Link href="/" className="text-accent underline">
            메인으로 가서 만들어 보기
          </Link>
        </p>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/specs/${item.id}`}
                className="block rounded-card border border-border bg-card p-4"
              >
                <p className="text-xs text-muted">
                  {item.timeframe} · {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </p>
                <p className="mt-1 font-bold">{item.product_name}</p>
                {item.one_liner && <p className="text-sm text-muted">{item.one_liner}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
