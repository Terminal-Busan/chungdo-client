import type { Metadata } from "next";
import NavigationWorkspace from "@/component/navigation-workspace";

export const metadata: Metadata = {
  title: "분석 과정 | Welfare Next",
  description: "복지 지원 분석 과정과 다음 신청 경로를 확인해 보세요.",
};

export default function NavigatePage() {
  return <NavigationWorkspace />;
}
