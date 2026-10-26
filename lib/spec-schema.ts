// OpenAI 구조화 출력용 JSON Schema. docs/API.md 6번의 Spec과 같은 모양이어야 한다.
// strict 규칙: 모든 object에 additionalProperties: false, 모든 속성을 required에 넣는다.
const str = { type: "string" } as const;

function obj(properties: Record<string, unknown>) {
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

function list(items: unknown) {
  return { type: "array", items };
}

export const specSchema = obj({
  product_name: str,
  one_liner: str,
  problem: str,
  target_users: list(obj({ persona: str, pain: str })),
  core_features: list(
    obj({
      name: str,
      description: str,
      priority: { type: "string", enum: ["P0", "P1"] },
    }),
  ),
  user_flow: list(str),
  screens: list(obj({ name: str, purpose: str })),
  data_model: list(obj({ table: str, columns: list(str) })),
  api_endpoints: list(
    obj({
      method: { type: "string", enum: ["GET", "POST", "PATCH", "DELETE"] },
      path: str,
      description: str,
    }),
  ),
  out_of_scope: list(str),
  risks: list(str),
  checklist: list(obj({ task: str, owner: str })),
  first_prompt: str,
});
