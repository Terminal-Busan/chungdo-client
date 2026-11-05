# API CONTRACT — Welfare Next

> 실제 Server 구현과 Microsoft Copilot SDK 연결 방식이 확정되기 전의 MVP 계약 초안이다. 필드 변경 시 client/server가 함께 갱신한다.

## 공통 규칙
- Base URL: `NEXT_PUBLIC_API_URL`
- Content-Type: `application/json`
- Error Shape: `{ "code": "...", "message": "..." }`
- 인증: MVP에서는 TBD

## POST /api/welfare/analyze
- 목적: 탈락 사유 설명 + 대체 정책 추천 + 다음 행동을 한 번의 사용자 흐름으로 반환
- 프론트 호출 위치: SCR-01

### Request
```json
{
  "appliedPolicy": "주거지원",
  "rejectionReason": "소득기준 초과",
  "profile": {
    "age": 27,
    "householdType": "1인 가구",
    "income": 2500000,
    "region": "경상북도 청도군"
  }
}
```

### Success 200
```json
{
  "reasonExplanation": {
    "summary": "신청한 정책의 소득 기준과 현재 입력 조건이 맞지 않아 탈락한 것으로 분석됩니다.",
    "details": ["입력된 탈락 사유를 바탕으로 한 쉬운 설명"],
    "keyCondition": "소득 기준"
  },
  "recommendations": [
    {
      "policyId": "sample-1",
      "name": "대체 정책명",
      "reason": "현재 입력 조건에서 검토할 수 있는 후보입니다.",
      "eligibility": [
        { "label": "연령", "status": "MATCH", "value": "확인 값" },
        { "label": "소득", "status": "CHECK_REQUIRED", "value": "추가 확인 필요" }
      ]
    }
  ],
  "nextActions": [
    {
      "type": "CHECK_DOCUMENTS",
      "title": "필요 서류 확인",
      "description": "추천 정책의 공식 안내에서 제출서류를 확인하세요."
    }
  ]
}
```

### Frontend Type 기준
- `status`: `MATCH | MISMATCH | CHECK_REQUIRED`
- `recommendations`: 빈 배열 가능
- `nextActions`: 빈 배열 가능. UI는 Empty 상태 처리
- 미확인 값은 `null` 가능 여부를 서버 구현 전에 확정

### Errors
- 400: 필수 입력 누락 또는 형식 오류
```json
{ "code": "INVALID_INPUT", "message": "입력 조건을 확인해주세요." }
```
- 500: AI/서버 분석 실패
```json
{ "code": "ANALYSIS_FAILED", "message": "분석 중 오류가 발생했습니다. 다시 시도해주세요." }
```

## 변경 이력
- v0.1: 해커톤 병렬 개발용 최초 초안
