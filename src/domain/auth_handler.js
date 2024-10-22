
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config');

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





module.exports = { createUser,findUserByEmail, generateAccessToken, generateRefreshToken, generateCsrfToken };