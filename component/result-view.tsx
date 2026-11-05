"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnalysisResults from "@/component/analysis-results";
import SiteFooter from "@/component/site-footer";
import SiteHeader from "@/component/site-header";
import { analyzeWelfare, isDemoMode } from "@/component/welfare-api";
import { loadRequest } from "@/component/welfare-session";
import type {
  WelfareAnalysis,
  WelfareAnalysisRequest,
} from "@/component/welfare-types";

type ViewState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error"; message: string }
  | { status: "success"; analysis: WelfareAnalysis };

export default function ResultView() {
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const [request, setRequest] = useState<WelfareAnalysisRequest | null>(null);

  async function run(target: WelfareAnalysisRequest) {
    setState({ status: "loading" });
    try {
      setState({ status: "success", analysis: await analyzeWelfare(target) });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      });
    }
  }

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    async function restore() {
      // Session storage is an external source available only in the browser.
      const stored = await Promise.resolve().then(loadRequest);
      if (!active) return;
      if (!stored) {
        setState({ status: "missing" });
        return;
      }
      setRequest(stored);
      try {
        const analysis = await analyzeWelfare(stored, controller.signal);
        if (active) setState({ status: "success", analysis });
      } catch (error) {
        if (active) setState({
          status: "error",
          message: error instanceof Error ? error.message : "분석 중 문제가 발생했습니다.",
        });
      }
    }
    void restore();
    return () => { active = false; controller.abort(); };
  }, []);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="result-page page-width">
        <Link className="back-link" href="/">
          ← 조건 수정해서 다시 찾기
        </Link>

        {state.status === "loading" && (
          <div className="result-loading" role="status" aria-live="polite">
            <span className="spinner spinner-dark" aria-hidden="true" />
            조건을 확인하고 있어요
          </div>
        )}

        {state.status === "missing" && (
          <div className="empty-state">
            <div>
              <h3>분석할 입력 정보가 없어요</h3>
              <p>
                처음 화면에서 신청 결과와 조건을 입력하고 다시 시작해
                주세요.
              </p>
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="error-panel" role="alert">
            <span className="error-symbol" aria-hidden="true">
              !
            </span>
            <div>
              <strong>분석을 불러오지 못했어요</strong>
              <p>{state.message}</p>
            </div>
            {request && (
              <button
                type="button"
                className="retry-button"
                onClick={() => void run(request)}
              >
                다시 시도
              </button>
            )}
          </div>
        )}

        {state.status === "success" && (
          <>
            {isDemoMode && (
              <p className="demo-note">
                서버 연결 전 시연용 예시 결과예요. 실제 정책 기준과 다를 수
                있습니다.
              </p>
            )}
            <AnalysisResults analysis={state.analysis} />
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
