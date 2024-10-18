const {SECURE, HTTP_ONLY, SAME_SITE} = require("../config");
const{isValidUser, generateAccessToken, generateRefreshToken, generateCsrfToken, findUserByEmail}= require('../domain/auth_handler');
//const jwt = require('jsonwebtoken');
//require('dotenv').config(); 

/* function findUserByEmail(email) {
    const users = [
        { email: "admin@example.com", password: "1234", role: "admin" },
        { email: "user1@example.com", password: "2345", role: "user" }
    ];
    return users.find(user => user.email === email);
}
 */

exports.bearerLogin = (req, res) => {
    const { email, password } = req.body;

    // Verify the user's credentials (this is just an example)
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }
  
    // Generate the access and refresh tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user) 
    // Respond with tokens
    res.json({
      accessToken,
      refreshToken,
    });
  };

exports.TESTbearerLogin = async (req, res) => {
    
    const {email, password} = req.body; // consent should be true
    
    if (!email) {
        return res.status(400).send({ error: "Email is required!" });
    }
    if (!password) {
        return res.status(400).send({ error: "Password is required!" });
    } 
    /* if (!consent) {
        return res.status(400).send({ error: "User consent is required!" });
    }  */

    //const user = {email, password, consent};
    const user = findUserByEmail(email);
    if(user&& isValidUser== true){
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const csrfToken = generateCsrfToken();

    res.cookie('accessToken', accessToken, {
        httpOnly:HTTP_ONLY,
        secure: SECURE,
        maxAge: 15* 60* 1000,// 15min
        sameSite: SAME_SITE
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly:HTTP_ONLY,
      secure:SECURE,
      maxAge: 7*24*60*60*1000, //7days
      path: '/refresh',
      sameSite: SAME_SITE
    })

    res.json({csrfToken});
    res.status(200).send("Login successful & Bearer token provided");

} else {
    
    console.error("Login error:", error);
    res.status(500).send("Internal server error. Please try again later.");
}

}

exports.refreshToken = (req, res) => {
    res.status(200).send("Bearer token refreshed");
};

exports.digestLogin = (req, res) =>{
    res.status(200).send("Digest login succesful!")
}

exports.customLogin = (req, res) => {
    res.status(200).send("Custom login succresful")
}

exports.nologinLogin = (req, res) =>{
    //const user = req.body || {user: 'user@example.com'};
     const {email, password, consent} = req.body;
    
    if (!email) {
        return res.status(400).send({ error: "Email is required!" });
    }
    if (!password) {
        return res.status(400).send({ error: "Password is required!" });
    } 
    if (!consent) {
        return res.status(400).send({ error: "User consent is required!" });
    } 

    const user = {email, password, consent};
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const csrfToken = generateCsrfToken();

    res.cookie('accessToken', accessToken, {
        httpOnly:HTTP_ONLY,
        secure: SECURE,
        maxAge: 15* 60* 1000,// 15min
        sameSite: SAME_SITE
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly:HTTP_ONLY,
      secure:SECURE,
      maxAge: 7*24*60*60*1000, //7days
      path: '/refresh',
      sameSite: SAME_SITE
    })

    res.json({csrfToken});
}
/**
 * Delete cookie when token expire/ when the uer logout
 */

exports.logout =(req, res) =>{

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).send("Logout successful");
}

/**
 * Delete Userdata and view own data here? or Backend server?
 */

exports.deleteUser = (req, res) =>{
    try{
        //Add logic User can delete own data
        //const user ={logic find user by ID}
        if(user == undefined){
            res.status(404).send("User not found!");
            return;
     }
     res.status(204).json(deletelogic);
  }catch(error){
      console.log(error);
      res.status(500).send(error)
  }
}

exports.getOwnData = (req, res) =>{
    try{
        //Add logic User can get own data
           if(user == undefined){
               res.status(404).send("User not found!");
               return;
        }
        res.status(200).json(user);
     }catch(error){
         console.log(error);
         res.status(500).send("Something went wrong. please try again later.")     
    }  
}