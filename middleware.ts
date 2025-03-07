import { next } from "@vercel/edge";

export const config = {
  matcher: "/(.*)", // 全ページに適用
};

export default function middleware(request: Request) {
  const vercelEnv = process.env.VERCEL_ENV; // Vercel 環境変数を取得
  console.log("Vercel Environment:", vercelEnv); // ログで確認

  // プレビュー環境のみ制限をかける
  const isRestrictedInPreview = vercelEnv === "preview";

  // プレビュー環境以外はスルー
  if (!isRestrictedInPreview) {
    return next(); 
  }

  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader) {
    const basicAuth = authorizationHeader.split(" ")[1];
    const [user, password] = atob(basicAuth).split(":");

    if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
      return next(); // 認証成功なら進む
    }
  }

  // 認証が必要な場合、Basic Authのダイアログを表示
  return new Response("Basic Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
