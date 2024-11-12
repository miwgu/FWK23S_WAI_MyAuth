const {SECURE, HTTP_ONLY, SAME_SITE} = require("../config");
const{createUser,findUserByEmail, generateAccessToken, generateRefreshToken, generateCsrfToken, verifyRecaptcha, match_hashedPass, getAllUsers}= require('../domain/auth_handler');

   exports.csrfLogin = async (req, res) =>{
    const { email, password, token} = req.body; // add recaptcha Token

    //Validate reCaptcha token
    const isRecaptchaValid = await verifyRecaptcha(token);
    console.log("reCAPTCHA Validation Result:", isRecaptchaValid);
    if (!isRecaptchaValid){
        return res.status(400).send({message: "reCAPTCHA verification failed."})
    }

    // Verify the user's credentials (this is just an example)
    const user = await findUserByEmail(email);
    console.log("User-controller", user)
    if (!user ) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const match = await match_hashedPass(password, user.password)
    if(!match){
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    /**
     * Check if user has 'admin' role
     */
    
    if(user.role !== 'admin'){
      return res.status(401).json({ message: 'You are not Admin' });
    }

 
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    const csrfToken = generateCsrfToken();
    const csrfTokenExpiry= Date.now() + 60* 60* 1000; // 1hour
    req.session.csrfToken = csrfToken;// save csrf token
    req.session.csrfTokenExpiry = csrfTokenExpiry;
    console.log("CSRF/token", csrfToken)
    console.log("CSRF/Expiry", csrfTokenExpiry)

    res.cookie('accessToken', accessToken, {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 15 * 60 * 1000,
        sameSite: SAME_SITE
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/refresh',
        sameSite: SAME_SITE
    });

    // Save CSRF token in a non-HTTP-only cookie
    /* res.cookie('csrfToken', csrfToken, {
        httpOnly: false, // Allows client-side JavaScript to access it
        secure: SECURE,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: SAME_SITE
    });
    */
    res.json({ csrfToken });
} 

exports.getallusers = async(req, res) =>{
    try{
     const users = await getAllUsers();
     res.json(users);
    }catch (error){
     console.error(error);
     res.status(500).send({message: 'Error fetching users'});
    }
}


exports.register = (req, res) => {
    const user = req.body;

    const newUser = createUser(user);
    
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken ()
    const csrfToken = generateCsrfToken();

    res.cookie('accessToken', accessToken, {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 15 * 60 * 1000,
        sameSite: SAME_SITE
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/refresh',
        sameSite: SAME_SITE
    });

    res.json({ csrfToken });
}

//----------Old one I do not use this approach -----------------------
/**
 * csrf token is sent when user access application  
 * @param {*} req 
 * @param {*} res 
 */
exports.csrf =(req, res)=> {
    const csrfToken = generateCsrfToken()

    // Save CSRF token in a non-HTTP-only cookie
    res.cookie('csrfToken', csrfToken, {
        httpOnly: false, // Allows client-side JavaScript to access it
        secure: SECURE,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: SAME_SITE
    });
   
       res.json({
           csrfToken
       });
   }

exports.oldbearerLogin = (req, res) => {
    const { email, password, csrfToken } = req.body;

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