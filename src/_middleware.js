const BASIC_USER = 'admin'
const BASIC_PASS = 'admin'

async function errorHandling(context) {
  try {
    return await context.next()
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 })
  }
}

async function handleRequest({ next, request }) {
  // Authorization ヘッダーを確認して、ログを表示
  console.log('Authorization Header:', request.headers.get('Authorization'))

  // 認証に関する処理
  if (request.headers.has("Authorization")) {
    const Authorization = request.headers.get('Authorization')

    // Basic 認証であるかどうかを確認
    const [scheme, encoded] = Authorization.split(' ')

    if (!encoded || scheme !== 'Basic') {
      return new Response(`The Authorization header must start with Basic`, {
        status: 400,
      })
    }

    // base64 デコードしてユーザー名とパスワードを抽出
    const buffer = Uint8Array.from(atob(encoded), (character) =>
      character.charCodeAt(0)
    )
    const decoded = new TextDecoder().decode(buffer).normalize()

    const index = decoded.indexOf(':')

    // ユーザー名とパスワードの検証
    if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
      return new Response('Invalid authorization value.', { status: 400 })
    }

    const user = decoded.substring(0, index);
    const pass = decoded.substring(index + 1);

    // ユーザー名とパスワードを確認
    if (BASIC_USER !== user || BASIC_PASS !== pass) {
      return new Response('Invalid credentials.', { status: 401 })
    }

    // 認証が成功した場合、次の処理へ進む
    return await next()
  }

  // 認証されていない場合、基本認証を促すレスポンスを返す
  return new Response('You need to login.', {
    status: 401,
    headers: {
      // 基本認証のダイアログを表示
      'WWW-Authenticate': 'Basic realm="my scope", charset="UTF-8"',
    },
  })
}

export const onRequest = [errorHandling, handleRequest]
