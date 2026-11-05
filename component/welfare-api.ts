import type {
  EligibilityStatus,
  WelfareAnalysis,
  WelfareAnalysisRequest,
} from "@/component/welfare-types";

import { mockAnalysis } from "@/component/welfare-mock";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

// API 주소가 없으면 시연용 예시 결과를 보여줍니다.
export const isDemoMode = configuredApiUrl === "";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isEligibilityStatus(value: unknown): value is EligibilityStatus {
  return (
    value === "MATCH" ||
    value === "MISMATCH" ||
    value === "CHECK_REQUIRED"
  );
}

function isWelfareAnalysis(value: unknown): value is WelfareAnalysis {
  if (!isRecord(value) || !isRecord(value.reasonExplanation)) return false;

  const explanation = value.reasonExplanation;
  const validExplanation =
    isString(explanation.summary) &&
    isString(explanation.keyCondition) &&
    Array.isArray(explanation.details) &&
    explanation.details.every(isString);

  const validRecommendations =
    Array.isArray(value.recommendations) &&
    value.recommendations.every(
      (policy) =>
        isRecord(policy) &&
        isString(policy.policyId) &&
        isString(policy.name) &&
        isString(policy.reason) &&
        (policy.supportDescription === undefined ||
          isString(policy.supportDescription)) &&
        Array.isArray(policy.eligibility) &&
        policy.eligibility.every(
          (item) =>
            isRecord(item) &&
            isString(item.label) &&
            isString(item.value) &&
            isEligibilityStatus(item.status),
        ),
    );

  const validActions =
    Array.isArray(value.nextActions) &&
    value.nextActions.every(
      (action) =>
        isRecord(action) &&
        isString(action.type) &&
        isString(action.title) &&
        isString(action.description),
    );

  return validExplanation && validRecommendations && validActions;
}

function getErrorMessage(body: unknown): string | undefined {
  if (!isRecord(body) || !isString(body.message)) return undefined;
  return body.message;
}

export async function analyzeWelfare(
  request: WelfareAnalysisRequest,
): Promise<WelfareAnalysis> {
  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return mockAnalysis;
  }

  const apiBase = configuredApiUrl.replace(/\/+$/, "");
  let response: Response;

  try {
    response = await fetch(`${apiBase}/api/welfare/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error(
      "분석 서버에 연결할 수 없습니다. API 주소와 서버 상태를 확인한 뒤 다시 시도해 주세요.",
    );
  }

  const responseText = await response.text();
  let body: unknown;
  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      body = undefined;
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(body) ??
        `분석 요청을 완료하지 못했습니다. (오류 ${response.status})`,
    );
  }

  if (!isWelfareAnalysis(body)) {
    throw new Error(
      "분석 결과 형식이 올바르지 않습니다. 잠시 후 다시 시도해 주세요.",
    );
  }

  return body;
}
