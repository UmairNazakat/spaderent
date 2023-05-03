const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/Signup', userController.createUser);
router.get('/checkemail', userController.checkemail);
router.get('/Signin', userController.Signin);
router.get('/Signinall', userController.Signinall);
router.get('/Signinall', userController.Signinall);
router.post('/resetEmail', userController.createResetEmail);
router.post('/verifyResetEmailCode', userController.verifyResetEmailCode);
router.post('/updatePassword', userController.updatePassword);
router.post('/resendCode', userController.resendCode);

module.exports = router;
