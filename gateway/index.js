const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({path:'../.env'})

const cookieParser = require('cookie-parser');
const { rateLimiter, corsHandler, verifyToken} = require('./middlewares');
const httpProxy = require("http-proxy");

const app = express();

const PORT = process.env.API_GATEWAY_PORT || 8020;
const AUTH_MS_PORT = process.env.AUTH_MS_PORT || 8021;
const READ_MS_PORT = process.env.READ_MS_PORT || 8022;
const WRITE_MS_PORT = process.env.WRITE_MS_PORT || 8023;
const RT_MS_PORT = process.env.RT_MS_PORT || 8024;
const SOCKET_IO_PORT= process.env.RT_MS_PORT ||8025

const requestLogger = (req, res, next) => {
  const { method, url, headers } = req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);
  // console.log('Headers:', JSON.stringify(headers, null, 2));

  // Optional: You can log the body if it's a POST or PUT request
  if (method === 'POST' || method === 'PUT') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }

  // Pass control to the next middleware or route handler
  next();
};

/*** Middleware setting ***/
app.use(rateLimiter);

app.use(cookieParser());

app.use(corsHandler)

// app.use(requestLogger)

const createProxyRoute = (method, path, target, newRoute, protected = true, usesParams = false) => {
  // console.log(`Proxying [\`${path}\`] to [\`${newRoute}\`]`);
  const middlewares = protected ? [verifyToken] : [];

  app[method](path, ...middlewares, createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: (path, req) => {
      if (usesParams === false) {
        return newRoute;
      }

      const params = req.params;
      let modifiedRoute = newRoute;
      for (const param in params) {
        modifiedRoute = modifiedRoute.replace(`:${param}`, params[param].replace(':', ''));
      }

      return modifiedRoute;
    },
    on: {
      proxyReq: (proxyReq, req) => {
        if (protected === true) {
          proxyReq.setHeader('Verified', JSON.stringify(req.verified));
        }
      },
    },
    logLevel: 'debug' // Optional: To help debug the proxying process
  }));
};

/* Read routes GET, protected, params */
const readRoutesGetProtectedParams = ['/v1/transactions/:year/:month', '/v1/start-data/:year/:month']
readRoutesGetProtectedParams.forEach(route=> createProxyRoute('get', route, `http://localhost:${READ_MS_PORT}`, route, true, true))


/* Write routes PUT, protected */
const writeRoutesPutProtected = ['/v1/transactions', '/v1/expense', '/v1/income']
writeRoutesPutProtected.forEach(route => createProxyRoute('put', route, `http://localhost:${WRITE_MS_PORT}`, route, true, false));

/* Write routes PUT, protected, params */
const writeRoutesPutProtectedParams = ['/v1/nickname/:nickname']
writeRoutesPutProtectedParams.forEach(route => createProxyRoute('put', route, `http://localhost:${WRITE_MS_PORT}`, route, true, true));


/* Auth routes POST, unprotected */
const authRoutesPost = ['/v1/login', '/v1/google-login', '/v1/signup', '/v1/logout']
authRoutesPost.forEach(route => createProxyRoute('post', route, `http://localhost:${AUTH_MS_PORT}`, route, false, false));


/* Real time routes POST, protected */
const realTimeRoutesPostProtected = ['/v1/invite', '/v1/leave']
realTimeRoutesPostProtected.forEach(route => createProxyRoute('post', route, `http://localhost:${RT_MS_PORT}`, route, true, false));


/* Real time routes POST, unprotected, with params */
const realTimeRoutesPostParams = ['/v1/accept-invite/:token']
realTimeRoutesPostParams.forEach(route => createProxyRoute('get', route, `http://localhost:${RT_MS_PORT}`, route, false, true));


app.use("/socket.io", verifyToken,
  createProxyMiddleware({
      target: 'http://localhost:8025/socket.io',
      changeOrigin: true,
      ws: true,
      // logger: console,
      on: {
        proxyReq: (proxyReq, req) => {
          if(req.verified){
            proxyReq.setHeader('Verified', JSON.stringify(req.verified));
          }else{
            console.log("verified is null")
          }
        },
        error: (err, req, res) => {
          console.error('Proxy error:', err);
          // res.statusCode(500).send('Proxy error');
        },
      },
  })
);

// Start the API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
