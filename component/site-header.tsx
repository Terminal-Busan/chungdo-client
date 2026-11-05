import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Welfare Next 홈">
        <span className="brand-mark" aria-hidden="true">
          <Image
            src="/logo.png"
            alt=""
            width={156}
            height={156}
            priority
          />
        </span>
        <span className="brand-name">Welfare Next</span>
      </Link>
      <a className="header-link" href="#analysis-form">
        내 상황으로 찾아보기
      </a>
    </header>
  );
}
