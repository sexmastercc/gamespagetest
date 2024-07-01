const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url'); // Import the url module

const app = express();

const getCurrentDomain = (req) => {
  // Safely access req.headers.host and provide a default value if undefined
  const host = req.headers && req.headers.host? req.headers.host : 'localhost';
  const protocol = req.protocol || 'http'; // Default to http if not defined
  
  // Correctly construct the base URL
  const baseUrl = `${protocol}://${host}`;
  
  // Parse the base URL to get the hostname
  const parsedUrl = new url.URL(baseUrl);
  return `${parsedUrl.hostname}/ngg`;
};

const nggUrl = getCurrentDomain({ protocol: 'https', host: 'mathsspot.com' }); // Example initial value

const proxy = createProxyMiddleware({
  target: nggUrl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  router: function(req) {
    if (req.headers && req.headers.host === 'mathsspot.com') {
      req.headers['x-forwarded-for'] = ''; 
      req.headers['x-real-ip'] = '';
      req.headers['via'] = '';
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
