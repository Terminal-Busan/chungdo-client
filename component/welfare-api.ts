import type { EligibilityStatus, WelfareAnalysis, WelfareAnalysisRequest } from "@/component/welfare-types";
import { mockAnalysis } from "@/component/welfare-mock";

const apiBase = (process.env.NEXT_PUBLIC_API_URL?.trim() || "/backend").replace(/\/+$/, "");
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export type PolicyOption = { id: string; name: string; agency: string | null; region: string | null };

type AnalysisResult = {
  rejection: { plain_summary: string; failed_criteria: { criterion: string; explanation: string }[]; glossary: { term: string; meaning: string }[] };
  alternatives: { policy_id: string; name: string; reason: string; criteria: { name: string; status: "pass" | "fail" | "unknown"; detail: string }[] }[];
  next_actions: { type: string; title: string; description: string }[];
  disclaimer: string;
};

async function api(path: string, init: RequestInit = {}) {
  const response = await fetch(`${apiBase}${path}`, { ...init, cache: "no-store" });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `서버 요청을 완료하지 못했습니다. (오류 ${response.status})`);
  }
  return response;
}

export async function searchPolicies(query: string, signal?: AbortSignal): Promise<PolicyOption[]> {
  const response = await api(`/api/policies?${new URLSearchParams({ q: query.trim(), limit: "20" })}`, { signal });
  const body = await response.json();
  if (!Array.isArray(body.data) || !body.data.every((p: PolicyOption) => typeof p.id === "string" && typeof p.name === "string")) {
    throw new Error("정책 목록을 읽을 수 없습니다. 다시 검색해 주세요.");
  }
  return body.data;
}

function convertResult(result: AnalysisResult): WelfareAnalysis {
  const statuses: Record<string, EligibilityStatus> = { pass: "MATCH", fail: "MISMATCH", unknown: "CHECK_REQUIRED" };
  return {
    reasonExplanation: {
      summary: result.rejection.plain_summary,
      details: [
        ...result.rejection.failed_criteria.map((item) => item.explanation),
        ...result.rejection.glossary.map((item) => `${item.term}: ${item.meaning}`),
        result.disclaimer,
      ].filter(Boolean),
      keyCondition: result.rejection.failed_criteria.map((item) => item.criterion).join(", ") || "담당 기관의 선정기준 확인이 필요해요.",
    },
    recommendations: result.alternatives.map((policy) => ({
      policyId: policy.policy_id, name: policy.name, reason: policy.reason,
      eligibility: policy.criteria.map((item) => ({ label: item.name, value: item.detail, status: statuses[item.status] || "CHECK_REQUIRED" })),
    })),
    nextActions: result.next_actions,
  };
}

async function readResult(response: Response): Promise<WelfareAnalysis> {
  if (!response.body) throw new Error("분석 연결을 시작하지 못했습니다.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      if (done && buffer.trim()) buffer += "\n\n";
      let separator;
      while ((separator = /\r?\n\r?\n/.exec(buffer))) {
        const block = buffer.slice(0, separator.index);
        buffer = buffer.slice(separator.index + separator[0].length);
        const lines = block.split(/\r?\n/);
        const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
        const data = lines.filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
        if (!data || !["result", "error"].includes(event || "")) continue;
        const payload = JSON.parse(data);
        if (event === "result") {
          try { return convertResult(payload); }
          catch { throw new Error("분석 결과 형식이 올바르지 않습니다. 다시 시도해 주세요."); }
        }
        if (payload.fallback !== true) throw new Error(payload.message || "분석을 완료하지 못했습니다.");
      }
      if (done) break;
      if (buffer.length > 1024 * 1024) throw new Error("분석 응답을 읽을 수 없습니다.");
    }
    throw new Error("분석 연결이 종료되었습니다. 다시 시도해 주세요.");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function analyzeWelfare(request: WelfareAnalysisRequest, signal?: AbortSignal): Promise<WelfareAnalysis> {
  if (isDemoMode) return mockAnalysis;
  if (!request.appliedPolicyId || !request.consent || !request.profile.housingType || !request.profile.employmentStatus) {
    throw new Error("처음 화면에서 정책과 현재 상황을 다시 선택하고 저장 동의 후 시작해 주세요.");
  }
  const combinedSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(160000)]) : AbortSignal.timeout(160000);
  const [sido, ...sigungu] = request.profile.region.trim().split(/\s+/);
  const response = await api("/api/navigations", {
    method: "POST", signal: combinedSignal, headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applied_policy_id: request.appliedPolicyId, rejection_text: request.rejectionReason || null, consent: request.consent,
      profile: {
        age: request.profile.age, sido, sigungu: sigungu.join(" ") || null,
        household_type: request.profile.householdType,
        household_size: request.profile.householdSize,
        income_monthly_manwon: Math.floor(request.profile.income / 10000),
        housing_type: request.profile.housingType, employment_status: request.profile.employmentStatus,
        has_disability: request.profile.hasDisability,
      },
    }),
  });
  const body = await response.json();
  if (typeof body.data?.id !== "string") throw new Error("분석 세션을 만들지 못했습니다.");
  return readResult(await api(`/api/navigations/${encodeURIComponent(body.data.id)}/stream`, {
    signal: combinedSignal, headers: { Accept: "text/event-stream" },
  }));
}
