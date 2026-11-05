import type { WelfareAnalysis } from "@/component/welfare-types";
import NextActions from "@/component/next-actions";
import PolicyRecommendations from "@/component/policy-recommendations";
import ReasonSummary from "@/component/reason-summary";

type AnalysisResultsProps = {
  analysis: WelfareAnalysis;
};

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="analysis-results" aria-live="polite">
      <div className="results-intro">
        <h2>다음으로 이어지는 길을 확인해 보세요.</h2>
      </div>
      <ReasonSummary explanation={analysis.reasonExplanation} />
      <PolicyRecommendations recommendations={analysis.recommendations} />
      <NextActions actions={analysis.nextActions} />
    </div>
  );
}
