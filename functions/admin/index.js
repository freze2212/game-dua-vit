function getLoginHtml() {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Admin Login</title>
</head>
<body>
  <h2>Admin Portal</h2>
</body>
</html>`;
}

export async function onRequest(context) {
  return new Response(getLoginHtml(), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}