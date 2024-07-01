const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const github = 'https://github.com';

const proxy = createProxyMiddleware({
  target: github,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  router: function(req) {
    return github;
  }
});

app.use('/github', proxy);
app.use('/electrical-development', proxy);
app.use('*', proxy);

const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`CybriaGG is running on port ${port}`);
});
