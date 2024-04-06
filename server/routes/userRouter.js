const route = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = route.Router();


router.post('/verify', authController.verifyEmail);
router.post('/confirm', authController.confirmEmail);
router.patch('/logout', authController.protect, authController.logout);

router.patch('/addFriend/:id', authController.protect, userController.addFriend);
router.patch('/deleteFriend/:id', authController.protect, userController.deleteFriend);
router.patch('/acceptFriend/:id', authController.protect, userController.acceptFriend);
router.patch('/declineFriend/:id', authController.protect, userController.declineFriend);
router.patch('/updateMe', authController.protect, userController.updateMe);

router.get('/me', authController.protect, userController.getMe);
router.get('/unique/:email', authController.protect, userController.getUser);
router.get('/friends', authController.protect, userController.getMyFriends);
router.get('/friends-received', authController.protect, userController.getFriendRequestsReceived)

module.exports = router;



