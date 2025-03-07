import { next } from "@vercel/edge";

export const config = {
  matcher: "/(.*)", // 全ページに適用
};

export default function middleware(request: Request) {
  const vercelEnv = process.env.VERCEL_ENV; // Vercel 環境変数を取得
  console.log("Vercel Environment:", vercelEnv); // ログで確認

  const url = new URL(request.url);

  // 本番環境では `/contact/` のみ制限
  const isRestrictedInProduction = vercelEnv === "production";

  // プレビュー環境ではサイト全体を制限
  const isRestrictedInPreview = vercelEnv === "preview";

  console.log("isRestrictedInProduction:", isRestrictedInProduction);
  console.log("isRestrictedInPreview:", isRestrictedInPreview);

  if (!isRestrictedInProduction && !isRestrictedInPreview) {
    return next(); // 制限不要ならスルー
  }

  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader) {
    const basicAuth = authorizationHeader.split(" ")[1];
    const [user, password] = atob(basicAuth).split(":");

    if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
      return next(); // 認証成功なら進む
    }
  }

  return new Response("Basic Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
