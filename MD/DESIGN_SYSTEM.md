# Design System — Welfare Next

## 브랜드 키워드 및 타깃
- 명확함: 복잡한 행정 정보를 빠르게 이해해야 한다.
- 신뢰감: 복지·자격정보를 다루므로 과장된 확정 표현을 피한다.
- 안도감: 탈락 이후에도 다음 선택지가 있음을 차분하게 보여준다.

## Color Tokens
- primary: #2563EB
- primary-hover: #1D4ED8
- background: #F8FAFC
- surface: #FFFFFF
- foreground: #0F172A
- muted: #64748B
- border: #E2E8F0
- success: #15803D
- warning: #B45309
- danger: #B91C1C

## Typography Scale
- Font: Pretendard, system-ui, sans-serif
- H1: 32px / 700 / 1.25
- H2: 24px / 700 / 1.35
- H3: 18px / 600 / 1.4
- Body: 16px / 400 / 1.6
- Caption: 14px / 400 / 1.5

## Spacing / Radius / Layout
- spacing: 4, 8, 12, 16, 24, 32, 48, 64px
- input radius: 10px
- button radius: 10px
- card radius: 16px
- max-width: 1080px
- page padding: mobile 20px / desktop 32px
- mobile-first, 주요 breakpoint 768px

## Component Variants & States
- Button: primary / secondary / outline / loading / disabled
- Input·Textarea·Select: label / help / error
- Card: 기본 정책 카드 / 강조 추천 카드
- Badge: 충족 / 확인 필요 / 조건 불일치
- Alert: 정보 / 주의 / 오류
- LoadingState / ErrorState / EmptyState

## Responsive Rules
- 모바일에서는 모든 카드 1열
- 조건 비교표는 작은 화면에서 행 기반 카드로 변환하거나 가로 넘침 없이 줄바꿈
- 핵심 CTA는 모바일에서 충분한 터치 영역 확보

## Accessibility Checklist
- 모든 form control에 label 연결
- focus-visible 스타일 유지
- 색상과 텍스트를 함께 사용해 상태 전달
- 오류는 필드 근처에 표시
- Loading 중 중복 제출 방지
