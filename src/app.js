const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const {AUTH, AUTH_TYPES} = require('./config');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin (our frontend)
    methods: ['GET', 'POST'], // Allow only certain HTTP methods
    //allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
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