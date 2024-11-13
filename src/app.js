const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const {AUTH, AUTH_TYPES, SECURE, CORS_ALLOWED_ORIGINS} = require('./config');
const app = express();

if (SECURE) {
    app.use(helmet()); // Enable all default security headers in the production environment
} else {
    app.use(
        helmet({
            contentSecurityPolicy: false, // Allow external scripts and resources to be loaded during development
            crossOriginEmbedderPolicy: false,
            crossOriginOpenerPolicy: false,
            crossOriginResourcePolicy: false,
            hsts: false, // HTTPS enforcement is not required in the development environment
            dnsPrefetchControl: false, // Release DNS prefetch suppression.
            hidePoweredBy: false, // Do not hide the Express display
            frameguard: { action: 'deny' }, // Clickjacking measures are maintained
            noSniff: true, // Maintain MIME-type safety improvements
            xssFilter: true // Maintain anti-XSS headers
        })
    );
}

app.use(
    helmet.hsts({
      maxAge: 60 * 60 , // production-> 1year 60 * 60 * 24 * 365,
      includeSubDomains: true, 
      preload: false, //production ->true
    })
  );

app.use(cors({
    //origin: 'http://localhost:5000', // Allow only this origin (our frontend)
    
    origin: (origin, callback) => {
        const isAllowed = CORS_ALLOWED_ORIGINS.some(allowedOrigin => {
            return typeof allowedOrigin === 'string' ? allowedOrigin === origin :
                allowedOrigin.test(origin);
        });

        if (!origin || isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'], // Allow only certain HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'], // Allow specific headers
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

app.get('/', (req, res)=> {
    res.send({});
});

const authRouter = {
    [AUTH_TYPES.NONE]: require('./routes/auth_routes'),
    [AUTH_TYPES.BASIC]: require('./routes/basic_auth_routes'),
    [AUTH_TYPES.BEARER]: require('./routes/bearer_auth_routes'),
    /* [AUTH_TYPES.DIGEST]: require('./routes/digest_auth_routes'),
    [AUTH_TYPES.CUSTOM]: require('./routes/custom_auth_routes'), */
    
} [AUTH] || require('./routes/defaultAuthRouter');

//app.use('/api/auth', authRouter);
app.use('/api/auth',require('./routes/bearer_auth_routes')) ;
app.use((req, res)=> res.status(404).send('Not Found'));

/* const csrfValidation = require('./csrfValidation');

// Example protected route
app.post('/protected-route', csrfValidation, (req, res) => {
    res.send('Protected data');
}); */

module.exports = app;