const route = require('express');

const authController = require('../controllers/authController');

const router = route.Router();


router.post('/verify', authController.verifyEmail);
router.post('/confirm', authController.confirmEmail);

module.exports = router;



