"use client";

import { useState, type FormEvent } from "react";
import type {
  AnalysisFormValues,
  WelfareAnalysisRequest,
} from "@/component/welfare-types";

type AnalysisFormProps = {
  isLoading: boolean;
  onSubmit: (request: WelfareAnalysisRequest) => void;
};

const initialValues: AnalysisFormValues = {
  appliedPolicy: "",
  rejectionReason: "",
  age: "",
  householdType: "",
  income: "",
  region: "",
};

const demoValues: AnalysisFormValues = {
  appliedPolicy: "주거지원",
  rejectionReason: "소득인정액이 기준을 초과해 지원 대상에서 제외되었습니다.",
  age: "27",
  householdType: "1인 가구",
  income: "2500000",
  region: "경상북도 청도군",
};

export default function AnalysisForm({
  isLoading,
  onSubmit,
}: AnalysisFormProps) {
  const [values, setValues] = useState(initialValues);

  function updateValue(field: keyof AnalysisFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      appliedPolicy: values.appliedPolicy.trim(),
      rejectionReason: values.rejectionReason.trim(),
      profile: {
        age: Number(values.age) || 0,
        householdType: values.householdType,
        income: Number(values.income) || 0,
        region: values.region.trim(),
      },
    });
  }

  return (
    <form className="analysis-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="applied-policy">신청했던 정책</label>
          <input
            id="applied-policy"
            name="appliedPolicy"
            autoComplete="off"
            placeholder="예: 청년 월세 지원"
            value={values.appliedPolicy}
            onChange={(event) =>
              updateValue("appliedPolicy", event.target.value)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="rejection-reason">안내받은 탈락 사유</label>
          <textarea
            id="rejection-reason"
            name="rejectionReason"
            rows={3}
            placeholder="결과 통지서에 적힌 내용을 그대로 적어도 괜찮아요."
            value={values.rejectionReason}
            onChange={(event) =>
              updateValue("rejectionReason", event.target.value)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="age">나이</label>
          <div className="input-with-suffix">
            <input
              id="age"
              name="age"
              type="number"
              min={0}
              max={120}
              step={1}
              inputMode="numeric"
              placeholder="예: 27"
              value={values.age}
              onChange={(event) => updateValue("age", event.target.value)}
            />
            <span>세</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="household-type">가구 형태</label>
          <select
            id="household-type"
            name="householdType"
            value={values.householdType}
            onChange={(event) =>
              updateValue("householdType", event.target.value)
            }
          >
            <option value="">가구 형태를 선택해 주세요</option>
            <option value="1인 가구">1인 가구</option>
            <option value="2인 가구">2인 가구</option>
            <option value="3인 가구">3인 가구</option>
            <option value="4인 이상 가구">4인 이상 가구</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="income">월 소득</label>
          <div className="input-with-suffix">
            <input
              id="income"
              name="income"
              type="number"
              min={0}
              step={10000}
              inputMode="numeric"
              placeholder="예: 2500000"
              value={values.income}
              onChange={(event) => updateValue("income", event.target.value)}
              aria-describedby="income-help"
            />
            <span>원</span>
          </div>
          <p className="field-help" id="income-help">
            세전 월 소득을 원 단위로 적어주세요.
          </p>
        </div>

        <div className="field">
          <label htmlFor="region">거주 지역</label>
          <input
            id="region"
            name="region"
            autoComplete="address-level1"
            placeholder="예: 경상북도 청도군"
            value={values.region}
            onChange={(event) => updateValue("region", event.target.value)}
          />
        </div>
      </div>

      <div className="form-bottom">
        <p className="privacy-note">
          입력한 정보는 복지 조건을 살펴보는 데 사용돼요.
        </p>
        <div className="form-actions">
          <button
            className="demo-button"
            type="button"
            onClick={() => setValues(demoValues)}
            disabled={isLoading}
          >
            시연 사례 입력
          </button>
          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                조건을 살펴보고 있어요
              </>
            ) : (
              <>
                다음 지원 찾기
                <span className="button-arrow" aria-hidden="true">
                  →
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
