const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const nggUrl = 'https://mathsspot.com';

const proxy = createProxyMiddleware({
  target: nggUrl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  router: function(req) {
    if (req.headers.host === 'mathsspot.com') {
      req.headers['X-Forwarded-For'] = ''; 
      req.headers['X-Real-IP'] = '';
      req.headers['Via'] = '';
    }
    return nggUrl;
  }
});

// Apply the proxy middleware only to requests starting with '/ngg'
app.use('/ngg', proxy);

const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`CybriaGG is running on port ${port}`);
});
