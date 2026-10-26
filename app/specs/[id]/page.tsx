import { Suspense } from "react";
import SpecDetail from "@/components/SpecDetail";

// params를 기다리는 부분은 Suspense로 감싼다 (cacheComponents 규칙).
async function Detail({ params }: { params: PageProps<"/specs/[id]">["params"] }) {
  const { id } = await params;
  return <SpecDetail id={id} />;
}

export default function SpecDetailPage(props: PageProps<"/specs/[id]">) {
  return (
    <Suspense fallback={<p className="p-8 text-muted">불러오는 중...</p>}>
      <Detail params={props.params} />
    </Suspense>
  );
}
