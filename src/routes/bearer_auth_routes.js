const router = require('express').Router();
const authController = require("../controllers/auth_controller");
const csrfValidation = require('../csrfValidation');

router.patch('/csrf', authController.csrf)
router.post('/oldlogin', authController.oldbearerLogin);
router.post('/login', authController.csrfLogin);

//If I need to get own data here Auth server. May be like this..
router.get('/getowndata', csrfValidation, authController.getOwnData);

module.exports = router;