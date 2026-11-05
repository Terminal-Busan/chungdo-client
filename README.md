This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Azure 데모 배포

GitHub Actions 탭에서 **Run workflow**를 누르면 빌드한 웹을 기존 `chungdo-client-dev` App Service에 배포합니다.

기존 Azure OIDC 시크릿과 연동된 App Service가 필요합니다. Linux App Service에서 Node.js 24를 선택하고, 시작 명령을 지정하는 경우 `npm start`를 사용합니다. 워크플로에서 빌드한 ZIP을 배포하므로 App Service의 배포 시 빌드는 끕니다.

Actions 실행 요약에서 실제 웹 URL을 확인할 수 있습니다. API는 별도의 `chungdo-server` 저장소에서 배포합니다.
