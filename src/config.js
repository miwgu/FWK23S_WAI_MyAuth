require('dotenv').config({ path: './src/.env' }); // Load environment variables

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET|| 'yEZEPxsooHnX3Fv8lNdttw==';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'LZi9HK+8zt2+OByBwN2xyg==';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET ;
const DOCKER_NETWORK_RANGE_REGEXP = /^http:\/\/172\.20\.0\.\d{1,4}$/;
const CORS_ALLOWED_ORIGINS = ['http://localhost:5000', DOCKER_NETWORK_RANGE_REGEXP];
//const SAME_SITE ="Strict";

const AUTH_TYPES ={
   BASIC: "Basic",
   BEARER: "Bearer",
   DIGEST: "Digest",
   CUSTOM: "Custom",
   NONE: "None"
};

const SAME_SITE_TYPES ={
   STRICT: "Strict",
   LAX: "Lax",
   NONE: "None"
};

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const SECURE = process.env.NODE_ENV === 'production';//true or false
const HTTP_ONLY = process.env.HTTP_ONLY || true;

const AUTH = AUTH_TYPES[(process.env.AUTH|| 'NONE').toUpperCase()] || AUTH_TYPES.NONE;
const SAME_SITE = SAME_SITE_TYPES[(process.env.SAME_SITE ||'STRICT').toUpperCase()] || SAME_SITE_TYPES.STRICT;

module.exports = {HOST,PORT,SECURE,HTTP_ONLY,AUTH,AUTH_TYPES,SAME_SITE,SAME_SITE_TYPES,ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET, RECAPTCHA_SECRET, CORS_ALLOWED_ORIGINS}
