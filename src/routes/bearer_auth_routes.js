const router = require('express').Router();
const authController = require("../controllers/auth_controller");
router.post('/login', authController.bearerLogin);

//If I need to get own data here Auth server.
router.get('/getowndata', authController.getOwnData);

module.exports = router;