const router = require('express').Router();
const authController = require("../controllers/auth_controller");

router.patch('/csrf', authController.csrf)
router.post('/oldlogin', authController.oldbearerLogin);
router.post('/login', authController.csrfLogin);

//If I need to get own data here Auth server.
router.get('/getowndata', authController.getOwnData);

module.exports = router;