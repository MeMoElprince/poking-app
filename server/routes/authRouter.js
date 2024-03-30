const route = require('express');

const authController = require('../controllers/authController');

const router = route.Router();


router.get('/verify', authController.verifyEmail);

module.exports = router;



