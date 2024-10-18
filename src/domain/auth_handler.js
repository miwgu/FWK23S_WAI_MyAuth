
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config');

// Function to generate a secure CSRF token
function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');  // Generate a random 32-byte token
}

console.log(generateCsrfToken())
/**
 * Users and Validation
 */
const users =[
    {email:"admin@example.com", password: "1234", role:"admin"},
    {email: "user1@example.com", password: "2345", role: "user"}
];

const findUserByEmail= (email)=>{
    return users.find(user=> user.email === email)
}

function generateAccessToken(user) {
    return jwt.sign({email: user.email, role: user.role}, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign({email: user.email, role: user.role}, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


/*  const isValidUser = async (email, password) =>{
    const user =findUserByEmail(email)
    if(user){
        const matchPass= await user.password === password
        if(matchPass){
            return true;
        }else{
            console.log("Password does not match")
            return false;
        }
    } else {
        console.log("Email does not match")
        return false;
    }
}  */





module.exports = { findUserByEmail, generateAccessToken, generateRefreshToken, generateCsrfToken };