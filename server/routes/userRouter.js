const route = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = route.Router();


router.post('/verify', authController.verifyEmail);
router.post('/confirm', authController.confirmEmail);


router.patch('/updateMe', authController.protect, userController.updateMe);
router.get('/me', authController.protect, userController.getMe);
router.get('/unique', userController.getUser);



module.exports = router;



