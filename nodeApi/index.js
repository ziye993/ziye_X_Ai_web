
const http = require('http');
const url = require('url');
const apiEndpoint = "https://api.x.ai/v1/chat/completions"; // 替换为实际的 API 端点
const server = http.createServer((req, res) => {
  // 解析请求 URL
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/xai') {
    // 目标接口的 URL
    const targetUrl = apiEndpoint;

    // 转发请求到目标接口
    const proxyReq = http.request(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body
    }, (proxyRes) => {
      // 设置响应头
      res.writeHead(proxyRes.statusCode, proxyRes.headers);

      // 流式传输数据
      proxyRes.pipe(res);
    });

    // 处理错误
    proxyReq.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('An error occurred while processing your request');
    });

    // 转发请求体
    req.pipe(proxyReq);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});