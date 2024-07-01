const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url'); // Import the url module

const app = express();

const getCurrentDomain = (req) => {
  const baseUrl = `${req.protocol}://${req.headers.host}`;
  const parsedUrl = new url.URL(baseUrl, req.url);
  return `${parsedUrl.hostname}/ngg`;
};

const nggUrl = getCurrentDomain({ protocol: 'https', host: 'mathsspot.com' }); // Example initial value

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
    // Update the nggUrl dynamically based on the current request
    nggUrl = getCurrentDomain(req);
    return nggUrl;
  }
});

app.use('/', proxy);

const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`CybriaGG is running on port ${port}`);
});
