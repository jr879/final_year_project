const express = require('express')
const cors = require('cors')
const request = require('request')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

let app = express();

// Setting up the app to avoid CORS errors
app.use(cors());
app.options('*', cors());
app.use(cookieParser());

// Allow all valid requests. This will need to be adjusted for security reasons when hosting the website
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
});

// Access & Refresh tokens stored in memory as variables
let accessToken;
let refreshToken;

/**
 * This backend contains sensitive data, such as the Spotify API key and cloud database configuration.
 * To protect users, any data that could be harmful/provide access to a user data has been replaced with this empty string variable.
 * This data is only present in the production environment, and not within GitHub or my code submission.
 */ 
let anonymisedData = "";

// After authentication, direct the user to this address
let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

// Firebase Config. Some details are anonymised to protect user data, as if they weren't you could access the database
const firebaseConfig = {
  apiKey: anonymisedData,
  authDomain: anonymisedData,
  databaseURL: anonymisedData,
  projectId: anonymisedData,
  storageBucket: anonymisedData,
  messagingSenderId: anonymisedData,
  appId: anonymisedData,
  measurementId: anonymisedData
};

// Logging a user in. Importantly, sets the scope of what my application is authorised to do
app.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: anonymisedData,
      scope: 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read user-library-modify streaming ',
      redirect_uri
    }))
})

// After a successful login, direct the user to the web application with full access
app.get('/callback', function (req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        anonymisedData + ':' + anonymisedData
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    accessToken = body.access_token;
    refreshToken = body.refresh_token;
    console.log(accessToken);
    console.log(refreshToken);
    let uri = 'http://localhost:3000/dashboard'
    // The access token is required in the frontend to setup spotify's playback SDK (which can only be done from the frontend)
    res.redirect(uri + '?access_token=' + accessToken)
  })
})

// Refresh a user's access token using their refresh token
app.get('/refresh', function (req, res) {
  console.log("old token: " + accessToken)
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        anonymisedData + ':' + anonymisedData
        // process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    accessToken = body.access_token;
    console.log("new token: " + accessToken);
  })
})

// Return the user's display name
app.get('/user', async (req, res) => {

  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true
  };

  request.get(options, function (error, response, body) {
    res.send(body.display_name)
  });
});

// Setup the browser for streaming Spotify content
app.post('/setupDevice', bodyParser.text(), (req, res) => {
  console.log("Setup device endpoint accessed");
  let deviceId = JSON.parse(req.body).deviceId;

  var options = {
    url: 'https://api.spotify.com/v1/me/player',
    body: JSON.stringify({ "device_ids": [deviceId] }),
    headers: { 'Authorization': 'Bearer ' + accessToken },
    method: 'PUT'
  };

  request.put(options, function (error, response, body) {
  });
})

// Save the user's current layout to the database
app.post('/saveLayout', bodyParser.text(), (req, res) => {
  console.log("Setup device endpoint accessed");
  let deviceId = JSON.parse(req.body).deviceId;

  var options = {
    url: '',
    body: JSON.stringify({ "device_ids": [deviceId] }),
    headers: { 'Authorization': 'Bearer ' + accessToken },
    method: 'PUT'
  };
})

// Load the user's layout. This is a work in progress and will be completed
app.get('/load', async (req, res) => {
  res.send(firebaseConfig);
  console.log(firebaseConfig);
})

// Play a track with a given contextUri
app.get('/play', (req, res) => {
  console.log("Play endpoint accessed");
  let url = req.originalUrl;
  let contextUri = url.substring(url.lastIndexOf('/') + 9);

  var options = {
    url: 'https://api.spotify.com/v1/me/player/play',
    body: JSON.stringify({ context_uri: contextUri }),
    headers: { 'Authorization': 'Bearer ' + accessToken },
    method: 'POST'
  };

  request.put(options, function (error, response, body) { });
})

// Hardcoded recomendation for testing purposes
app.get('/recs', async (req, res) => {
  console.log("Recommendations endpoint accessed");
  let seed = req.query.seed
  let formattedSeed = seed.substring(14);
  console.log(formattedSeed);
  var options = {
    url: 'https://api.spotify.com/v1/recommendations?&seed_tracks=' + formattedSeed,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true
  };

  request.get(options, function (error, response, body) {
    res.send(body.tracks)
  });
});

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}.`)
app.listen(port)