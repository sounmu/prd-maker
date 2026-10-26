export type Priority = "P0" | "P1";

export type Spec = {
  product_name: string;
  one_liner: string;
  problem: string;
  target_users: { persona: string; pain: string }[];
  core_features: { name: string; description: string; priority: Priority }[];
  user_flow: string[];
  screens: { name: string; purpose: string }[];
  data_model: { table: string; columns: string[] }[];
  api_endpoints: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    path: string;
    description: string;
  }[];
  out_of_scope: string[];
  risks: string[];
  checklist: { task: string; owner: string }[];
  first_prompt: string;
};

export type SpecInput = {
  title: string;
  problem: string;
  target: string;
  timeframe: Timeframe;
};

export type SpecListItem = {
  id: string;
  created_at: string;
  title: string;
  product_name: string;
  timeframe: string;
  one_liner: string | null;
};

export type SpecRow = {
  id: string;
  created_at: string;
  title: string;
  problem: string;
  target: string | null;
  timeframe: string;
  product_name: string;
  spec: Spec;
};

export const TIMEFRAMES = ["해커톤 24시간", "1주", "1달"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];
