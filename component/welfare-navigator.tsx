"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import AnalysisForm from "@/component/analysis-form";
import SiteFooter from "@/component/site-footer";
import SiteHeader from "@/component/site-header";
import { saveRequest } from "@/component/welfare-session";
import type { WelfareAnalysisRequest } from "@/component/welfare-types";

export default function WelfareNavigator() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAnalyze(request: WelfareAnalysisRequest) {
    saveRequest(request);
    startTransition(() => router.push("/result"));
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <section className="landing-section intro-section" aria-labelledby="hero-heading">
          <div className="hero page-width">
            <div className="hero-copy">
              <h1 id="hero-heading">
                탈락했다고
                <br />
                <span>끝이 아니에요.</span>
              </h1>
              <p className="hero-description">
                어려운 탈락 사유를 쉽게 풀고,
                <br className="desktop-break" />
                지금 살펴볼 수 있는 다음 지원을 찾아드려요.
              </p>
              <a className="hero-cta" href="#analysis-form">
                내 상황으로 찾아보기
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="landing-section analysis-section"
          id="analysis-form"
          aria-labelledby="form-heading"
        >
          <div className="analysis-content page-width">
            <div className="form-section-heading">
              <div>
                <h2 id="form-heading">어떤 안내를 받으셨나요?</h2>
                <p>
                  결과 통지서와 현재 상황을 알려주시면 다음 선택지를 정리해 드릴게요.
                </p>
              </div>
            </div>

            <AnalysisForm isLoading={isPending} onSubmit={handleAnalyze} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
