const route = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = route.Router();


router.post('/verify', authController.verifyEmail);
router.post('/confirm', authController.confirmEmail);



router.patch('/addFriend/:id', authController.protect, userController.addFriend);
router.patch('/acceptFriend/:id', authController.protect, userController.acceptFriend);
router.patch('/declineFriend/:id', authController.protect, userController.declineFriend);
router.patch('/updateMe', authController.protect, userController.updateMe);

router.get('/me', authController.protect, userController.getMe);
router.get('/unique', userController.getUser);
router.get('/friends', authController.protect, userController.getMyFriends);


module.exports = router;



