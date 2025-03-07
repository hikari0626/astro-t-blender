import { next } from "@vercel/edge";

export const config = {
  matcher: "/(.*)", // 全ページに適用
};

export default function middleware(request: Request) {
  // Vercelの環境変数で本番環境かプレビュー環境かを判定
  const vercelEnv = process.env.VERCEL_ENV; // "production" | "preview" | "development"
  const url = new URL(request.url);

  // 本番環境では `/contact/` 以下のみ制限
  const isRestrictedInProduction = vercelEnv === "production" && url.pathname.startsWith("/contact");

  // プレビュー環境ではサイト全体を制限
  const isRestrictedInPreview = vercelEnv === "preview";

  if (!isRestrictedInProduction && !isRestrictedInPreview) {
    return next(); // 制限対象でなければそのまま通す
  }

  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader) {
    const basicAuth = authorizationHeader.split(" ")[1];
    const [user, password] = atob(basicAuth).toString().split(":");

    if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
      return next(); // 認証OKならそのまま進む
    }
  }

  return new Response("Basic Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
