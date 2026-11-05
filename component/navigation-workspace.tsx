"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./navigation-workspace.module.css";

type Policy = {
  id: string;
  name: string;
  reason: string;
  details: string;
  documents: string[];
  source: string;
  criteria: { label: string; value: string; status: "match" | "check" | "mismatch" }[];
};

const policies: Policy[] = [
  {
    id: "youth-rent",
    name: "청년 월세 한시 특별지원",
    reason: "1인 청년 가구를 대상으로 하며, 신청했던 주거지원과 기준이 달라 검토할 수 있어요.",
    details: "월세 부담을 덜 수 있도록 일정 기간 월 임차료를 지원하는 정책입니다.",
    documents: ["임대차계약서", "최근 3개월 월세 이체 내역", "가족관계증명서"],
    source: "https://www.gov.kr",
    criteria: [
      { label: "연령", value: "만 19~34세", status: "match" },
      { label: "가구", value: "1인 가구", status: "match" },
      { label: "소득", value: "기준 중위소득 확인 필요", status: "check" },
    ],
  },
  {
    id: "local-housing",
    name: "경북 청년 주거비 지원",
    reason: "거주 지역 기반 지원이라 경상북도 지자체 공고를 함께 확인해 볼 수 있어요.",
    details: "경상북도 거주 청년의 주거비 부담을 지원하는 지역 정책입니다.",
    documents: ["주민등록초본", "임대차계약서", "통장 사본"],
    source: "https://www.gov.kr",
    criteria: [
      { label: "지역", value: "경상북도 거주", status: "match" },
      { label: "거주 기간", value: "주민등록 기간 확인 필요", status: "check" },
      { label: "소득", value: "지자체 공고 확인 필요", status: "check" },
    ],
  },
];

const agentSteps = [
  {
    name: "사유해석 에이전트",
    description: "탈락 기준과 현재 조건을 비교하고 있어요.",
    status: "done",
  },
  {
    name: "정책매칭 에이전트",
    description: "탈락 조건을 피할 수 있는 대안을 찾았어요.",
    status: "done",
  },
  {
    name: "경로설계 에이전트",
    description: "확인할 서류와 신청 순서를 정리했어요.",
    status: "done",
  },
];

const pathway = [
  {
    order: 1,
    title: "탈락 기준 금액 확인하기",
    description: "결과 통지서에 적힌 소득 기준과 내 소득인정액을 비교해 보세요.",
  },
  {
    order: 2,
    title: "청년 월세 특별지원 조건 확인하기",
    description: "연령·가구·소득 조건을 공식 안내에서 확인해 보세요.",
  },
  {
    order: 3,
    title: "필요 서류 준비 후 신청하기",
    description: "임대차계약서와 월세 이체 내역을 준비하면 신청을 시작할 수 있어요.",
  },
];

export default function NavigationWorkspace() {
  const [selectedPolicy, setSelectedPolicy] = useState(policies[0]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  function askQuestion() {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setAnswer(
      trimmedQuestion.includes("서류")
        ? "먼저 임대차계약서와 최근 월세 이체 내역을 준비해 보세요. 최종 서류는 신청 기관의 최신 공고를 다시 확인해 주세요."
        : "이의신청 가능 여부는 탈락 통지서의 담당 기관에 문의해 주세요. 동시에 아래 대체 정책의 신청 조건도 확인해 보시는 것을 추천해요.",
    );
    setQuestion("");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Welfare Next 홈">
          <span className={styles.brandMark}>
            <Image src="/logo.png" alt="" width={156} height={156} priority />
          </span>
          <span>Welfare Next</span>
        </Link>
        <Link className={styles.headerLink} href="/">
          처음으로 돌아가기
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <Link className={styles.backLink} href="/">
              ← 입력 정보로 돌아가기
            </Link>
            <h1>다음으로 이어지는 길을 확인해 보세요.</h1>
            <p>입력한 조건을 바탕으로 탈락 이유와 다음 선택지를 정리했어요.</p>
          </div>
          <span className={styles.aiBadge}>AI 분석 결과 · 공식 정책 기준 확인 필요</span>
        </div>

        <section className={styles.timeline} aria-labelledby="timeline-heading">
          <div className={styles.sectionTitle}>
            <h2 id="timeline-heading">분석 과정</h2>
            <span>완료</span>
          </div>
          <ol className={styles.stepList}>
            {agentSteps.map((step) => (
              <li className={styles.step} key={step.name}>
                <span className={styles.stepDot} aria-hidden="true">✓</span>
                <div>
                  <strong>{step.name}</strong>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.reasonPanel} aria-labelledby="reason-heading">
          <div className={styles.reasonIcon} aria-hidden="true">i</div>
          <div>
            <div className={styles.panelEyebrow}>탈락 이유를 쉽게 풀면</div>
            <h2 id="reason-heading">소득인정액이 신청 기준보다 높게 계산되었어요.</h2>
            <p>소득과 재산을 합산해 계산한 금액이 해당 지원의 기준선을 넘은 것으로 보여요.</p>
            <div className={styles.glossary}>
              <strong>소득인정액</strong>
              <span>월 소득에 재산을 소득으로 환산한 금액을 더해 계산하는 기준이에요.</span>
            </div>
          </div>
          <div className={styles.condition}>
            <span>핵심 조건</span>
            <strong>소득 기준</strong>
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.panel} aria-labelledby="policy-heading">
            <div className={styles.sectionTitle}>
              <div>
                <h2 id="policy-heading">다음으로 살펴볼 정책</h2>
                <p>탈락 조건과 다른 가능성이 있는 정책부터 보여드려요.</p>
              </div>
              <span className={styles.sourceLabel}>출처: 정부24</span>
            </div>
            <div className={styles.policyList}>
              {policies.map((policy) => (
                <button
                  className={`${styles.policyCard} ${selectedPolicy.id === policy.id ? styles.policyCardSelected : ""}`}
                  key={policy.id}
                  type="button"
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <span className={styles.policyArrow}>↗</span>
                  <h3>{policy.name}</h3>
                  <p>{policy.reason}</p>
                  <div className={styles.criteriaPreview}>
                    {policy.criteria.map((criterion) => (
                      <span key={criterion.label} className={styles[criterion.status]}>
                        <i aria-hidden="true" />
                        {criterion.label} · {criterion.value}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <aside className={styles.detailPanel} aria-labelledby="detail-heading">
            <div className={styles.detailHeader}>
              <span className={styles.detailTag}>정책 상세</span>
              <a href={selectedPolicy.source} target="_blank" rel="noreferrer">
                공식 안내 ↗
              </a>
            </div>
            <h2 id="detail-heading">{selectedPolicy.name}</h2>
            <p>{selectedPolicy.details}</p>
            <h3>조건별 확인</h3>
            <ul className={styles.detailCriteria}>
              {selectedPolicy.criteria.map((criterion) => (
                <li key={criterion.label}>
                  <span>{criterion.label}</span>
                  <strong className={styles[criterion.status]}>{criterion.value}</strong>
                </li>
              ))}
            </ul>
            <h3>준비 서류</h3>
            <ul className={styles.documentList}>
              {selectedPolicy.documents.map((document) => <li key={document}>{document}</li>)}
            </ul>
          </aside>
        </div>

        <section className={styles.pathwayPanel} aria-labelledby="pathway-heading">
          <div className={styles.sectionTitle}>
            <div>
              <h2 id="pathway-heading">추천 경로</h2>
              <p>한 번에 다 하려고 하지 말고, 아래 순서대로 확인해 보세요.</p>
            </div>
          </div>
          <ol className={styles.pathwayList}>
            {pathway.map((item) => (
              <li key={item.order}>
                <span>{item.order}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.questionPanel} aria-labelledby="question-heading">
          <div>
            <h2 id="question-heading">더 궁금한 점이 있나요?</h2>
            <p>분석 결과를 바탕으로 다음 행동을 더 구체적으로 물어볼 수 있어요.</p>
          </div>
          <div className={styles.questionForm}>
            <label htmlFor="follow-up-question">후속 질문</label>
            <div>
              <input
                id="follow-up-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") askQuestion();
                }}
                placeholder="예: 신청할 때 필요한 서류가 뭐예요?"
              />
              <button type="button" onClick={askQuestion}>질문하기</button>
            </div>
            {answer && <p className={styles.answer}>{answer}</p>}
          </div>
        </section>

        <div className={styles.bottomActions}>
          <p>분석 결과는 24시간 동안 보관되며, 언제든 삭제할 수 있어요.</p>
          <button type="button" className={styles.deleteButton} onClick={() => setIsDeleteOpen(true)}>
            분석 결과 삭제
          </button>
        </div>
      </main>

      <aside className={styles.chatbotDock} aria-label="복지 정책 챗봇 준비 중">
        <div className={styles.chatbotHeader}>
          <span className={styles.chatbotIcon} aria-hidden="true">✦</span>
          <div>
            <strong>복지 정책 챗봇</strong>
            <span>정부 지원 정책을 물어보세요</span>
          </div>
          <span className={styles.comingSoon}>준비 중</span>
        </div>
        <div className={styles.chatbotBody}>
          <div className={styles.botMessage}>
            <span className={styles.botAvatar} aria-hidden="true">W</span>
            <p>
              궁금한 정책이나 신청 방법을
              <br />
              편하게 물어보세요.
            </p>
          </div>
          <div className={styles.suggestionList} aria-label="질문 예시">
            <span>이 정책에 필요한 서류는?</span>
            <span>이의신청은 어떻게 하나요?</span>
          </div>
        </div>
        <div className={styles.chatbotComposer}>
          <input
            type="text"
            placeholder="정책에 대해 질문해 보세요"
            aria-label="챗봇 질문"
            disabled
          />
          <button type="button" disabled aria-label="질문 보내기">↑</button>
        </div>
      </aside>

      {isDeleteOpen && (
        <div className={styles.modalBackdrop} role="presentation">
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-heading">
            <h2 id="delete-heading">분석 결과를 삭제할까요?</h2>
            <p>삭제하면 입력 정보와 분석 결과를 다시 확인할 수 없어요.</p>
            <div>
              <button type="button" onClick={() => setIsDeleteOpen(false)}>취소</button>
              <button type="button" className={styles.confirmDelete} onClick={() => { setIsDeleteOpen(false); setIsDeleted(true); }}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleted && (
        <div className={styles.deletedNotice} role="status">
          분석 결과를 삭제했어요. <Link href="/">처음으로 돌아가기</Link>
        </div>
      )}
    </div>
  );
}
