"use client";

import { useEffect, useRef, useState } from "react";
import "./policy-details.css";
import type {
  EligibilityItem,
  PolicyRecommendation,
} from "@/component/welfare-types";

type PolicyRecommendationsProps = {
  recommendations: PolicyRecommendation[];
};

const statusText: Record<EligibilityItem["status"], string> = {
  MATCH: "입력 조건과 일치",
  MISMATCH: "조건이 맞지 않음",
  CHECK_REQUIRED: "추가 확인 필요",
};

export default function PolicyRecommendations({
  recommendations,
}: PolicyRecommendationsProps) {
  const [selected, setSelected] = useState<PolicyRecommendation | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);

  return (
    <section className="result-section" aria-labelledby="recommendations-heading">
      <div className="section-heading">
        <div>
          <h2 id="recommendations-heading">지금 검토해볼 지원</h2>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">
            ?
          </span>
          <div>
            <h3>현재 조건으로 찾은 후보가 없어요</h3>
            <p>
              입력한 조건을 조금 더 확인하거나, 공식 복지 안내에서 다른 지원을
              살펴보세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="policy-list">
          {recommendations.map((policy, index) => (
            <article
              className={`policy-card${index === 0 ? " policy-card-featured" : ""}`}
              key={policy.policyId}
            >
              <h3>{policy.name}</h3>
              <button
                type="button"
                className="policy-card-open"
                aria-label={`${policy.name} 상세 내용 보기`}
                aria-haspopup="dialog"
                aria-controls="policy-detail-dialog"
                onClick={() => setSelected(policy)}
              />
              <p className="policy-reason">{policy.reason}</p>

              {policy.eligibility.length > 0 && (
                <div className="eligibility-list" aria-label="자격조건 비교">
                  {policy.eligibility.map((item, itemIndex) => (
                    <div
                      className="eligibility-row"
                      key={`${policy.policyId}-${item.label}-${itemIndex}`}
                    >
                      <span className="eligibility-label">{item.label}</span>
                      <span
                        className={`eligibility-status status-${item.status.toLowerCase()}`}
                      >
                        <span className="status-dot" aria-hidden="true" />
                        {statusText[item.status]}
                      </span>
                      <span className="eligibility-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <span className="policy-card-detail-label" aria-hidden="true">상세 내용 보기 <span>↗</span></span>
            </article>
          ))}
        </div>
      )}
      <dialog
        ref={dialog}
        id="policy-detail-dialog"
        className="policy-detail-dialog"
        aria-labelledby="policy-detail-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <div className="policy-detail-body">
            <header className="policy-detail-header">
              <span className="policy-detail-eyebrow">지원 상세 안내</span>
              <button type="button" className="policy-detail-close" aria-label="상세 내용 닫기" onClick={() => dialog.current?.close()}>×</button>
            </header>
            <h2 id="policy-detail-title">{selected.name}</h2>
            <section className="policy-detail-benefit" aria-labelledby="policy-benefit-title">
              <h3 id="policy-benefit-title">어떤 지원을 받을 수 있나요?</h3>
              <p>{selected.supportDescription?.trim() || "지원 내용이 아직 제공되지 않았어요. 해당 지원의 공식 공고에서 지원 방식과 금액을 확인해 주세요."}</p>
            </section>
            <section className="policy-detail-section">
              <h3>이 지원을 추천한 이유</h3>
              <p>{selected.reason}</p>
            </section>
            <section className="policy-detail-section">
              <h3>내 조건과 비교하기</h3>
              {selected.eligibility.length > 0 ? (
                <dl className="policy-detail-conditions">
                  {selected.eligibility.map((item, index) => (
                    <div key={`${item.label}-${index}`}>
                      <dt>{item.label}</dt>
                      <dd>
                        <span className={`eligibility-status status-${item.status.toLowerCase()}`}>
                          <span className="status-dot" aria-hidden="true" />
                          {statusText[item.status]}
                        </span>
                        <span>{item.value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : <p>현재 제공된 자격 조건 정보가 없어요.</p>}
            </section>
            <div className="policy-detail-guidance">
              <h3>신청 전에 확인해 주세요</h3>
              <p>신청 기간, 지원 내용, 제출 서류는 해당 지원의 공식 공고에서 확인해 주세요. 위 비교는 입력 조건을 바탕으로 한 검토 결과예요.</p>
            </div>
            <button type="button" className="policy-detail-done" onClick={() => dialog.current?.close()}>결과로 돌아가기</button>
          </div>
        )}
      </dialog>
      <p className="source-note">
        추천은 입력 조건을 바탕으로 한 검토 후보예요. 자격 여부와 최신 기준은
        반드시 공식 안내에서 확인해 주세요.
      </p>
    </section>
  );
}
