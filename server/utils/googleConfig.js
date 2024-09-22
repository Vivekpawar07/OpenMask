const { google } = require('googleapis');
require('dotenv').config()
const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
const GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET;

exports.oauth2client = new google.auth.OAuth2(
    GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_SECRET,
    'postmessage'
);