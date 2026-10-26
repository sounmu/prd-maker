import type { Spec } from "@/lib/types";

function bullets(items: string[]) {
  return items.map((i) => `- ${i}`).join("\n");
}

export function specToMarkdown(spec: Spec): string {
  return [
    `# ${spec.product_name}`,
    `> ${spec.one_liner}`,
    `## 문제\n${spec.problem}`,
    `## 타깃 유저\n${bullets(spec.target_users.map((u) => `**${u.persona}**: ${u.pain}`))}`,
    `## 핵심 기능\n${bullets(spec.core_features.map((f) => `[${f.priority}] **${f.name}**: ${f.description}`))}`,
    `## 유저 플로우\n${spec.user_flow.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    `## 화면\n${bullets(spec.screens.map((s) => `**${s.name}**: ${s.purpose}`))}`,
    `## 데이터 모델\n${spec.data_model
      .map((t) => `### ${t.table}\n${bullets(t.columns)}`)
      .join("\n\n")}`,
    `## API\n${bullets(spec.api_endpoints.map((e) => `\`${e.method} ${e.path}\`: ${e.description}`))}`,
    `## 이번에 안 하는 것\n${bullets(spec.out_of_scope)}`,
    `## 리스크\n${bullets(spec.risks)}`,
    `## 준비물·역할 분담 체크리스트\n${spec.checklist.map((c) => `- [ ] ${c.task} (${c.owner})`).join("\n")}`,
    `## 첫 프롬프트\n\`\`\`\n${spec.first_prompt}\n\`\`\``,
  ].join("\n\n");
}
