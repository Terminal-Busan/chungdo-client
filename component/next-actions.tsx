import type { NextAction } from "@/component/welfare-types";

type NextActionsProps = {
  actions: NextAction[];
};

export default function NextActions({ actions }: NextActionsProps) {
  return (
    <section className="result-section next-actions" aria-labelledby="actions-heading">
      <div className="section-heading">
        <div>
          <h2 id="actions-heading">다음에 무엇을 하면 되나요?</h2>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="empty-state action-empty">
          <div>
            <h3>다음 절차를 확인할 정보가 부족해요</h3>
            <p>
              신청 기관의 공식 안내에서 재신청이나 이의신청 가능 여부를
              확인해 주세요.
            </p>
          </div>
        </div>
      ) : (
        <ol className="action-list">
          {actions.map((action, index) => (
            <li className="action-item" key={`${action.type}-${index}`}>
              <span className="action-marker" aria-hidden="true">
                {index + 1}
              </span>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
