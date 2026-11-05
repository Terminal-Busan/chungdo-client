import type { Metadata } from "next";
import ResultView from "@/component/result-view";

export const metadata: Metadata = {
  title: "분석 결과 | Welfare Next",
};

export default function ResultPage() {
  return <ResultView />;
}
