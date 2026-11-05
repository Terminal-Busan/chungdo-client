import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Welfare Next 홈">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path
              d="M7 23.5 15.8 7l4.3 8.1 3-5.3L29 23.5H7Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="23.5" r="2.2" fill="currentColor" />
            <circle cx="15.8" cy="7" r="2.2" fill="currentColor" />
            <circle cx="23.1" cy="9.8" r="2.2" fill="currentColor" />
          </svg>
        </span>
        <span className="brand-name">Welfare Next</span>
      </Link>
      <a className="header-link" href="#analysis-form">
        내 상황으로 찾아보기
      </a>
    </header>
  );
}
