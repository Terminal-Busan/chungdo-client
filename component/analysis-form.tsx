"use client";

import { useRef, useState, type FormEvent } from "react";
import { searchPolicies, type PolicyOption } from "@/component/welfare-api";
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
  appliedPolicyId: "",
  rejectionReason: "",
  age: "",
  householdType: "",
  householdSize: "",
  housingType: "",
  employmentStatus: "",
  income: "",
  region: "",
};

const demoValues: AnalysisFormValues = {
  appliedPolicy: "주거지원",
  appliedPolicyId: "",
  rejectionReason: "소득인정액이 기준을 초과해 지원 대상에서 제외되었습니다.",
  age: "27",
  householdType: "single",
  householdSize: "1",
  housingType: "monthly_rent",
  employmentStatus: "employed",
  income: "2500000",
  region: "경상북도 청도군",
};

export default function AnalysisForm({
  isLoading,
  onSubmit,
}: AnalysisFormProps) {
  const [values, setValues] = useState(initialValues);
  const [policies, setPolicies] = useState<PolicyOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const searchVersion = useRef(0);

  async function findPolicies() {
    const version = ++searchVersion.current;
    setSearching(true);
    setMessage("");
    try {
      const found = await searchPolicies(values.appliedPolicy);
      if (version !== searchVersion.current) return;
      setPolicies(found);
      if (!found.length) setMessage("검색 결과가 없어요. 정책 이름을 짧게 입력해 다시 검색해 주세요.");
    } catch (error) {
      if (version === searchVersion.current) setMessage(error instanceof Error ? error.message : "정책 검색에 실패했습니다.");
    } finally {
      if (version === searchVersion.current) setSearching(false);
    }
  }

  function updateValue(field: keyof AnalysisFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.appliedPolicyId) {
      setMessage("검색 결과에서 신청했던 정책을 선택해 주세요.");
      return;
    }
    onSubmit({
      appliedPolicyId: values.appliedPolicyId,
      consent,
      appliedPolicy: values.appliedPolicy.trim(),
      rejectionReason: values.rejectionReason.trim(),
      profile: {
        age: Number(values.age) || 0,
        householdType: values.householdType,
        householdSize: Number(values.householdSize),
        housingType: values.housingType,
        employmentStatus: values.employmentStatus,
        hasDisability,
        income: Number(values.income) || 0,
        region: values.region.trim(),
      },
    });
  }

  return (
    <form className="analysis-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="applied-policy">신청했던 정책</label>
          <input
            id="applied-policy"
            name="appliedPolicy"
            autoComplete="off"
            placeholder="예: 청년 월세 지원"
            value={values.appliedPolicy}
            maxLength={50}
            required
            onChange={(event) => {
              updateValue("appliedPolicy", event.target.value);
              updateValue("appliedPolicyId", "");
              searchVersion.current++;
              setSearching(false);
              setPolicies([]);
              setMessage("");
            }}
          />
          <button type="button" className="demo-button" onClick={() => void findPolicies()} disabled={searching || !values.appliedPolicy.trim()}>
            {searching ? "정책을 찾고 있어요" : "정책 검색"}
          </button>
          {policies.length > 0 && <>
            <label htmlFor="policy-selection">신청했던 정책 선택</label>
            <select id="policy-selection" required value={values.appliedPolicyId} onChange={(event) => updateValue("appliedPolicyId", event.target.value)}>
              <option value="">검색 결과에서 선택해 주세요</option>
              {policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.name}{policy.agency ? ` · ${policy.agency}` : ""}</option>)}
            </select>
          </>}
          {message && <p role="alert" className="field-help">{message}</p>}
        </div>

        <div className="field">
          <label htmlFor="rejection-reason">안내받은 탈락 사유</label>
          <textarea
            id="rejection-reason"
            name="rejectionReason"
            rows={3}
            maxLength={2000}
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
              required
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
            required
            id="household-type"
            name="householdType"
            value={values.householdType}
            onChange={(event) =>
              updateValue("householdType", event.target.value)
            }
          >
            <option value="">가구 형태를 선택해 주세요</option>
            <option value="single">1인 가구</option>
            <option value="couple">부부 가구</option>
            <option value="single_parent">한부모 가구</option>
            <option value="multi_child">다자녀 가구</option>
            <option value="other">그 외 가구</option>
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
              required
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
            required
            maxLength={100}
            placeholder="예: 경상북도 청도군"
            value={values.region}
            onChange={(event) => updateValue("region", event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="household-size">가구원 수</label>
          <input id="household-size" type="number" min={1} max={10} step={1} required value={values.householdSize} onChange={(event) => updateValue("householdSize", event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="housing-type">주거 형태</label>
          <select id="housing-type" required value={values.housingType} onChange={(event) => updateValue("housingType", event.target.value)}>
            <option value="">주거 형태를 선택해 주세요</option>
            <option value="owned">자가</option><option value="jeonse">전세</option><option value="monthly_rent">월세</option><option value="other">그 외</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="employment-status">경제활동 상태</label>
          <select id="employment-status" required value={values.employmentStatus} onChange={(event) => updateValue("employmentStatus", event.target.value)}>
            <option value="">현재 상태를 선택해 주세요</option>
            <option value="employed">재직·자영업</option><option value="job_seeker">구직 중</option><option value="student">학생</option><option value="none">그 외</option>
          </select>
        </div>
      </div>
      <label className="consent-field"><input type="checkbox" checked={hasDisability} onChange={(event) => setHasDisability(event.target.checked)} /> 등록 장애에 해당해요</label>
      <label className="consent-field"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /> 입력한 상황과 분석 결과를 24시간 임시 저장하는 데 동의해요.</label>

      <div className="form-bottom">
        <p className="privacy-note">
          이름·주민번호·전화번호는 입력하지 마세요. 입력 정보는 조건 확인과 분석에 사용돼요.
        </p>
        <div className="form-actions">
          <button
            className="demo-button"
            type="button"
            onClick={() => {
              setValues(demoValues);
              setPolicies([]);
              searchVersion.current++;
              setSearching(false);
              setMessage("예시 상황을 채웠어요. 실제 정책을 검색해 선택한 뒤 진행해 주세요.");
            }}
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
