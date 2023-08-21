const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

router.get('/updatepassword/:resetpasswordid', passwordController.updatepassword)

router.get('/resetpassword/:id', passwordController.resetpassword)

// router.use('/forgotpassword', passwordController.forgotpassword)
router.post('/forgotpassword', passwordController.forgotpassword)

module.exports = router;