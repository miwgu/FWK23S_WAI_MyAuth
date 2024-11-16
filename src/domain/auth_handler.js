const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const qs = require('querystring');
const axios = require('axios');
const bcrypt = require('bcrypt');


const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, RECAPTCHA_SECRET } = require('../config');

async function verifyRecaptcha (token) {
  try {
    //const secretKey = env.process.RECAPTCHA_SECRET ;
    //const secretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Test secretKey
    const secretKey = RECAPTCHA_SECRET ; 
    console.log("Recaptcha_secretKey",secretKey );
    /* const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
          secret: secretKey,
          response: token
        }  
}); */
        const postData = qs.stringify({ secret: secretKey, response: token });

        const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        postData, 
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        const data = response.data;
        return data.success; // true verify success
        
        } catch (error){
            console.error("reCAPTCHA verificaion error:", error);
            return false;
        }
};

// Function to generate a secure CSRF token
function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');  // Generate a random 32-byte token
}

function createUser (){

}

/**
 * Users and Validation
 */

/* const users =[
    {email:"admin@example.com", password: "1234", role:"admin"},
    {email: "user1@example.com", password: "2345", role: "user"}
]; 

const findUserByEmail= (email)=>{
    return users.find(user=> user.email === email)
}
 */

const findUserByEmail = async(email) =>{
   try{
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length>0){
        console.log(rows[0])
        return rows[0];
    } else {
        return null;
    }

   } catch (error) {
    console.error('Database error', error);
     return null;
   } 
};

const match_hashedPass = async(password, hasedPass_database) =>{
 return await bcrypt.compare(password, hasedPass_database)
}

function generateAccessToken(user) {
    /* const payload ={
        id:user.id,
        email: user.email,
        groups:
        role: user.role,
    } */
    return jwt.sign({email: user.email, role: user.role}, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign({email: user.email, role: user.role}, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

const getAllUsers = async() =>{
    try{
     const [rows] = await db.query('SELECT id, email, username, role, avatar, created_at, updated_at FROM users');
     if (rows.length>0){
         console.log(rows)
         return rows;
     } else {
         return [];
     }
 
    } catch (error) {
     console.error('Database error', error);
      return [];
    } 
 };

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





module.exports = { createUser,findUserByEmail, generateAccessToken, generateRefreshToken, generateCsrfToken, verifyRecaptcha, match_hashedPass, getAllUsers };