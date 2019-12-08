const express = require('express');
const {
  registerUser,
  loginUser,
  getCurrentLoggedInUser,
  forgotPassword,
  resetPassword,
  updateUserDetalils,
  updateUserPassword,
  logOut
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentLoggedInUser);
router.get('/logout', protect, logOut);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateUserDetalils);
router.put('/updatepassword', protect, updateUserPassword);

module.exports = router;
