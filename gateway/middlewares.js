const rateLimit = require('express-rate-limit');
require('dotenv').config({path:'../.env'})
const { jwtDecode } = require("jwt-decode");
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const RATE_LIMIT_WINDOW_MINUTES = (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = process.env.MAX_REQUESTS_PER_IP || 100

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
if(!(JWT_SECRET_KEY)){
  throw new Error("Cannot start server without providing a JWT secret key")
}

/* 
  Synonymous with
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
*/
const corsHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
  
}

const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MINUTES,
  max: MAX_REQUESTS_PER_WINDOW,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
});

const JWKSCLIENT = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
});

// Function to get a key by its 'kid'
function getKey(header, callback) {
  JWKSCLIENT.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

const verifyToken = (req, res, next) => {
  const authHeader = req.cookies.Authorization;

  if (!authHeader) {
    return res.status(401).json('No Authorization cookie');
  }

  const decodedAuthHeader = decodeURIComponent(authHeader);
  const [scheme, token] = decodedAuthHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json('Invalid Authorization format');
  }

  const decoded = jwtDecode(token)
  const iss = decoded?.iss
  req.verified = {}

  switch (iss) {
    case 'https://budgetoo.eu':
      jwt.verify(token, JWT_SECRET_KEY, {}, (err, decoded) => {
        if (err) {
          return res.status(401).send('Invalid Token');
        }
        req.verified = decoded;
        res.cookie('user-data', JSON.stringify({
          iss: decoded?.iss,
          username: decoded?.sub,
          //TODO change to d name from db
          display_name: `${decoded?.sub}`
        }))

        next();
      });
      break;
    case 'accounts.google.com':
    case 'https://accounts.google.com':
      

      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
          return res.status(401).send('Invalid Token');
        }
        req.verified = decoded;
        res.cookie('user-data', JSON.stringify({
          iss: decoded?.iss,
          username: decoded?.sub,
          picture: decoded?.picture,
          display_name: `${decoded?.given_name} ${decoded?.family_name}`
        }))

        next();
      });

      break;

    default:
      res.status(401).json('Invalid token issuer')
  }

}


module.exports = {rateLimiter, corsHandler, verifyToken}