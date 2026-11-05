import type { WelfareAnalysis } from "@/component/welfare-types";

// 서버 연결 전 시연용 예시 데이터입니다. 실제 정책 기준과 다를 수 있습니다.
export const mockAnalysis: WelfareAnalysis = {
  reasonExplanation: {
    summary:
      "신청한 지원의 소득 기준보다 현재 소득이 높게 계산되어 대상에서 제외된 것으로 보여요.",
    details: [
      "소득인정액은 월 소득에 재산 등을 환산한 금액을 더해 계산해요.",
      "이 금액이 정책별 기준선을 넘으면 다른 조건을 충족해도 탈락할 수 있어요.",
      "통지서의 기준 금액과 내 소득인정액을 비교해 보면 정확한 차이를 알 수 있어요.",
    ],
    keyCondition: "소득 기준",
  },
  recommendations: [
    {
      policyId: "demo-youth-rent",
      name: "청년 월세 한시 특별지원",
      reason:
        "1인 청년 가구를 대상으로 하며 소득 기준이 주거지원과 달라 검토해 볼 수 있어요.",
      eligibility: [
        { label: "연령", status: "MATCH", value: "만 19~34세" },
        { label: "가구", status: "MATCH", value: "1인 가구" },
        { label: "소득", status: "CHECK_REQUIRED", value: "기준 중위소득 확인 필요" },
        { label: "지역", status: "MATCH", value: "전국" },
      ],
    },
    {
      policyId: "demo-local-housing",
      name: "경북 청년 주거비 지원",
      reason: "거주 지역 기반 지원으로 지자체 기준이 따로 적용돼요.",
      eligibility: [
        { label: "연령", status: "MATCH", value: "만 18~39세" },
        { label: "지역", status: "CHECK_REQUIRED", value: "주민등록 기간 확인 필요" },
        { label: "소득", status: "CHECK_REQUIRED", value: "지자체 공고 확인 필요" },
      ],
    },
    {
      policyId: "demo-hug-loan",
      name: "청년 전용 버팀목 전세대출",
      reason: "지원금이 아닌 저금리 대출로, 소득 상한이 비교적 높아요.",
      eligibility: [
        { label: "연령", status: "MATCH", value: "만 19~34세" },
        { label: "소득", status: "MISMATCH", value: "연 소득 상한 초과 가능성" },
        { label: "주택", status: "CHECK_REQUIRED", value: "임차 보증금 조건 확인" },
      ],
    },
  ],
  nextActions: [
    {
      type: "CHECK_DOCUMENTS",
      title: "탈락 통지서의 기준 금액 확인하기",
      description: "통지서에 적힌 소득 기준과 내 소득인정액을 비교해 보세요.",
    },
    {
      type: "APPEAL",
      title: "소득 산정에 오류가 없는지 확인하기",
      description:
        "반영된 소득이 실제와 다르다면 이의신청 가능 여부를 담당 기관에 문의하세요.",
    },
    {
      type: "APPLY_ALTERNATIVE",
      title: "청년 월세 한시 특별지원 공식 안내 보기",
      description: "신청 기간과 제출 서류를 복지로 공식 안내에서 확인하세요.",
    },
  ],
};
