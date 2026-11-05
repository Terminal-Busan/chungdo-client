import type { WelfareAnalysisRequest } from "@/component/welfare-types";

const REQUEST_KEY = "welfare-next:request";

export function saveRequest(request: WelfareAnalysisRequest) {
  try {
    sessionStorage.setItem(REQUEST_KEY, JSON.stringify(request));
  } catch {
    // 저장이 막힌 환경에서는 결과 페이지가 입력 없음 상태로 열립니다.
  }
}

export function loadRequest(): WelfareAnalysisRequest | null {
  try {
    const stored = sessionStorage.getItem(REQUEST_KEY);
    return stored ? (JSON.parse(stored) as WelfareAnalysisRequest) : null;
  } catch {
    return null;
  }
}
