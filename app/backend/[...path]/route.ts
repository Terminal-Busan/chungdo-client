import type { NextRequest } from "next/server";

// Resolve Aspire's API endpoint at request time, after the image is built.
async function proxy(request: NextRequest, context: RouteContext<"/backend/[...path]">) {
  const origin = process.env.API_SERVER_URL;
  if (!origin) {
    return Response.json({ message: "API 서버 연결 설정이 필요합니다." }, { status: 503 });
  }
  const { path } = await context.params;
  const url = new URL(path.map(encodeURIComponent).join("/"), `${origin.replace(/\/+$/, "")}/`);
  url.search = request.nextUrl.search;
  const headers = new Headers();
  for (const name of ["content-type", "last-event-id", "accept"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      signal: request.signal,
      redirect: "manual",
    });
    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["content-type", "x-accel-buffering"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json({ message: "분석 서버에 연결할 수 없습니다." }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const DELETE = proxy;
