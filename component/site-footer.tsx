import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-width">
        <Link className="footer-brand" href="/" aria-label="Welfare Next 홈">
          <span className="footer-brand-mark" aria-hidden="true">
            <Image src="/logo.png" alt="" width={156} height={156} />
          </span>
          Welfare Next
        </Link>
        <p>
          이 서비스의 결과는 참고용 안내이며, 실제 자격 여부는 해당 기관의 최신
          공식 안내를 확인해 주세요.
        </p>
      </div>
    </footer>
  );
}
