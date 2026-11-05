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
            </article>
          ))}
        </div>
      )}
      <p className="source-note">
        추천은 입력 조건을 바탕으로 한 검토 후보예요. 자격 여부와 최신 기준은
        반드시 공식 안내에서 확인해 주세요.
      </p>
    </section>
  );
}
