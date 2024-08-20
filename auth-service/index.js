require('dotenv').config({ path: '../.env' })
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const { jwtDecode } = require("jwt-decode");
const jwksClient = require('jwks-rsa');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const {db, Models} = require('../db/db.js')

/*  
    For authorization :
    "Verified" header contains {..., sub: email, _id,}
*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//TODO 
//Google public keys are regularly rotated; examine the Cache-Control header in the response to determine when you should retrieve them again.

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

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const GOOGLE_SECRET_KEY = process.env.GOOGLE_SECRET_KEY

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

//TODO update expires to google standard
const JWT_COOKIE_OPTIONS = { sameSite: 'none', secure: true, httpOnly: true}

if (!JWT_SECRET_KEY) {
  throw new Error("Cannot start server without providing a JWT secret key");
}

if (!(GOOGLE_SECRET_KEY)) {
  throw new Error("Cannot start server without providing a Google secret key")
}


// Signup endpoint
app.post('/v1/signup', async (req, res) => {

  let { email, display_name, password } = req.body;

  if (!display_name || display_name.trim() === '') {
    display_name = email;
  }

  try {

    const queriedUser = await Models.User.findOne({email})
    if(queriedUser){
      if(queriedUser.type == 'g'){
        return res.status(400).json({ error: 'A Google account with this email already exists' });
      }
      return res.status(400).json({ error: 'An account with this username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt)
    const newUser = new Models.User({password_hash, email, type: 'b'})
    await newUser.save()

    jwt.sign({ sub: email, iss: 'https://budgetoo.eu', _id: newUser._id,email: newUser.email}, JWT_SECRET_KEY, { expiresIn: '30d' }, (err, token) => {
      if (err) {
        console.error('Error signing JWT token:', err);
        return res.status(500).json({ error: 'Error signing JWT token' });
      }

      const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
      return res.cookie('Authorization', `Bearer ${token}`, { expires: expirationDate, ...JWT_COOKIE_OPTIONS }).status(200).json('Successfully logged in!');
    });
  } catch (error) {
    console.log('Error during signup', error);
    return res.status(500).json({ error: 'Error during signup' });
  }
});

// Login endpoint
app.post('/v1/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const queriedUser = await Models.User.findOne({email}).exec()

    if (!queriedUser) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const correctPassword = await bcrypt.compare(password, queriedUser.password_hash);
    if (!correctPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    jwt.sign({ sub: email, iss: 'https://budgetoo.eu', _id: queriedUser._id, email: queriedUser.email}, JWT_SECRET_KEY, { expiresIn: '30d' }, (err, token) => {
      if (err) {
        console.error('Error signing JWT token:', err);
        return res.status(500).json({ error: 'Error signing JWT token' });
      }
      const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
      
      res.cookie('Authorization', `Bearer ${token}`, { expires: expirationDate, ...JWT_COOKIE_OPTIONS }).status(200).json('Successfully logged in');
      return res.status(200)
    });
  } catch (error) {
    console.log('Error during login', error);
    return res.status(500).json({ error: 'Error during login' });
  }
});


const verifyGoogleToken = async (req, res, next) => {
  const { credential, g_csrf_token } = req.body
  const decoded = jwtDecode(credential)

  const cookieToken = req.cookies.g_csrf_token

  if (!cookieToken) {
    return res.status(400).json('No CSRF token in Cookie.')
  }

  if (!g_csrf_token) {
    return res.status(400).json('No CSRF token in post body.')
  }

  if (g_csrf_token != cookieToken) {
    return res.status(400).json('Failed to verify double submit cookie.')
  }

  jwt.verify(credential, getKey, { algorithms: ['RS256'] }, async (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    const queriedUser = await Models.User.findOne({g_id: decoded?.sub}).exec()
    if(!queriedUser){
      const newUser = await Models.User.create({
        email: decoded?.email,
        type: 'g',
        password_hash: null,
        g_id: decoded?.sub
      })
    }

    req.verified = decoded;
    next();
  });
}


app.post('/v1/google-login', verifyGoogleToken, (req, res) => {
  const { credential } = req.body
  const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
      return res.cookie('Authorization', `Bearer ${credential}`, { expires: expirationDate, ...JWT_COOKIE_OPTIONS }).status(200).redirect('http://localhost:5173/home');
});


app.post('/v1/logout', (req, res) => {
  res.clearCookie('Authorization', JWT_COOKIE_OPTIONS);
  return res.status(200).json({ message: 'Successfully logged out' });
});


const PORT = process.env.AUTH_MS_PORT || 8021;
app.listen(PORT, () => {
  console.log(`Auth-service running on port ${PORT}`);
});
