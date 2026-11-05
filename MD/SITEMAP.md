# Sitemap — Welfare Next

| ID | URL | 목적 | 핵심 컴포넌트 | API | 완료 기준 |
|---|---|---|---|---|---|
| SCR-01 | / | 탈락 정보와 사용자 조건 입력 | Hero, AnalysisForm, CTA | POST /api/welfare/analyze | 검증 후 분석 요청 가능 |
| SCR-02 | /result 또는 동일 페이지 결과 섹션 | 설명·추천·다음 행동 확인 | ReasonSummary, PolicyCards, EligibilityCompare, NextAction | 분석 응답 사용 | Loading/Error/Empty/Success 처리 |

## 최소 정보 구조
- Header: Welfare Next 로고/서비스명
- Main Input: 탈락 결과 + 사용자 조건
- Analysis Result: 탈락 사유 설명
- Alternative Policies: 추천 정책 카드
- Next Action: 사용자가 바로 확인할 행동
- Footer: AI 안내 및 정책 최신 정보 확인 주의
