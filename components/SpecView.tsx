import type { ReactNode } from "react";
import type { Spec } from "@/lib/types";

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </h3>
      {children}
    </section>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-bg p-3 font-mono text-sm">
      {children}
    </pre>
  );
}

export default function SpecView({ spec }: { spec: Spec }) {
  return (
    <article className="rounded-card border border-border bg-card p-5 sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-bold leading-tight">
            {spec.product_name}
          </h2>
          <p className="mt-1 text-muted">{spec.one_liner}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm"
        >
          마크다운 복사
        </button>
      </header>

      <Section label="문제">
        <p className="leading-7">{spec.problem}</p>
      </Section>

      <Section label="타깃 유저">
        <ul className="space-y-2">
          {spec.target_users.map((u) => (
            <li key={u.persona}>
              <span className="font-semibold">{u.persona}</span>
              <span className="text-muted"> · {u.pain}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="핵심 기능">
        <ul className="space-y-3">
          {spec.core_features.map((f) => (
            <li key={f.name} className="flex items-start gap-3">
              <span
                className={
                  f.priority === "P0"
                    ? "mt-0.5 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-card"
                    : "mt-0.5 rounded-md bg-border px-2 py-0.5 text-xs font-semibold text-muted"
                }
              >
                {f.priority}
              </span>
              <div>
                <p className="font-semibold">{f.name}</p>
                <p className="text-sm text-muted">{f.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="유저 플로우">
        <ol className="list-decimal space-y-1 pl-5 leading-7">
          {spec.user_flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section label="화면">
        <ul className="space-y-1">
          {spec.screens.map((s) => (
            <li key={s.name}>
              <span className="font-semibold">{s.name}</span>
              <span className="text-muted"> · {s.purpose}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="데이터 모델 / API">
        <div className="space-y-3">
          <Mono>
            {spec.data_model
              .map((t) => `${t.table}\n${t.columns.map((c) => `  ${c}`).join("\n")}`)
              .join("\n\n")}
          </Mono>
          <Mono>
            {spec.api_endpoints
              .map((e) => `${e.method} ${e.path}  ${e.description}`)
              .join("\n")}
          </Mono>
        </div>
      </Section>

      <Section label="이번에 안 하는 것">
        <ul className="list-disc space-y-1 pl-5 leading-7">
          {spec.out_of_scope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section label="리스크">
        <ul className="list-disc space-y-1 pl-5 leading-7">
          {spec.risks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section label="첫 프롬프트">
        <Mono>{spec.first_prompt}</Mono>
      </Section>
    </article>
  );
}
