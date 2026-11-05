import type { WelfareAnalysis } from "@/component/welfare-types";

type ReasonSummaryProps = {
  explanation: WelfareAnalysis["reasonExplanation"];
};

export default function ReasonSummary({ explanation }: ReasonSummaryProps) {
  return (
    <section className="reason-panel" aria-labelledby="reason-heading">
      <div className="reason-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 10.8v5.1M12 7.9h.01"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="reason-copy">
        <h2 id="reason-heading">왜 탈락했나요?</h2>
        <p className="reason-summary">{explanation.summary}</p>
        {explanation.details.length > 0 && (
          <ul className="reason-details">
            {explanation.details.map((detail, index) => (
              <li key={`${detail}-${index}`}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="key-condition">
        <span>살펴볼 조건</span>
        <strong>{explanation.keyCondition}</strong>
      </div>
    </section>
  );
}
