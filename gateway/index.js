const express = require('express');


const redis = require('redis');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({path:'../.env'})

const cors = require('cors')
const cookieParser = require('cookie-parser');
const { rateLimiter, corsHandler, verifyToken} = require('./middlewares');

const app = express();

const PORT = process.env.API_GATEWAY_PORT || 8020;
const AUTH_MS_PORT = process.env.AUTH_MS_PORT || 8021;
const READ_MS_PORT = process.env.READ_MS_PORT || 8022;
const WRITE_MS_PORT = process.env.WRITE_MS_PORT || 8023;



/*** Middleware setting ***/
app.use(rateLimiter);

app.use(cookieParser());

app.use(corsHandler)


const createProxyRoute = (method, path, target, newRoute, protected = true, usesParams = false) => {
  // console.log(`Proxying [\`${path}\`] to [\`${newRoute}\`]`);
  const middlewares = protected ? [verifyToken] : []

  app[method](path,  ...middlewares, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      if(usesParams === false){
        return newRoute
      }

      const params = req.params
      let modifiedRoute = newRoute
      for(const param in params){
        modifiedRoute = modifiedRoute.replace(`:${param}`, params[param].replace(':',''))
      }
      // console.log(modifiedRoute)
      return modifiedRoute
    },
    on: {
      proxyReq : (proxyReq, req)=>{
        if(protected === true){
          proxyReq.setHeader('Verified', JSON.stringify(req.verified))
        }
      },
      
    }
  }));
};

/* Read routes GET, protected, params */
const readRoutesGetParams = ['/v1/transactions/:year/:month', '/v1/start-data/:year/:month']
readRoutesGetParams.forEach(route=> createProxyRoute('get', route, `http://localhost:${READ_MS_PORT}`, route, true, true))


/* Read routes GET, protected */
// const readRoutesGet = ['/v1/start-data']
// readRoutesGet.forEach(route => createProxyRoute('get', route, `http://localhost:${READ_MS_PORT}`, route, true, false));


/* Write routes PUT, protected */
const writeRoutesPut = ['/v1/transactions']
writeRoutesPut.forEach(route => createProxyRoute('put', route, `http://localhost:${WRITE_MS_PORT}`, route, true, false));



/* Auth routes POST, unprotected */
const authRoutes = ['/v1/login', '/v1/google-login', '/v1/signup']
authRoutes.forEach(route => createProxyRoute('post', route, `http://localhost:${AUTH_MS_PORT}`, route, false, false));


// Routes for reading microservice
// app.use('/read', (req, res, next) => {
//   console.log('Request received on /read');
//   next();
// });

// // Proxy Middleware
app.use('/v1/hello', createProxyMiddleware({
  target: `http://localhost:${AUTH_MS_PORT}`,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    let newPath = '/v1/hello'; // Directly set to '/login' as '/read' seems to be stripped already
    return newPath;
  }
}));


// app.use('/hello', (req, res) => {
//   console.log('Handling response for /read');
//   res.status(404).send('No handler for /read');
// });

// Routes for writing microservice
// app.use('/write', verifyJWT, createProxyMiddleware({
//   target: 'http://localhost:5003', // Writing microservice
//   changeOrigin: true,
//   pathRewrite: {
//     '^/write': '/', // rewrite path if needed
//   }
// }));


// Start the API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
