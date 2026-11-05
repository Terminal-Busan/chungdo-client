import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welfare Next | 다음 복지를 찾는 길",
  description:
    "복지정책 탈락 사유를 쉽게 이해하고, 지금 검토할 수 있는 다음 지원을 찾아보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
