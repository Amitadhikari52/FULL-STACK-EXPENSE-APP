const express = require('express');
const router = express.Router();

const authenticatemiddleware = require('../middleware/auth');

const premiumFeatureController = require('../controllers/premiumController');


router.get('/showLeaderBoard', authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);

router.get('/download-expense',authenticatemiddleware.authenticate, premiumFeatureController.downloadexpense);

router.get('/show-old-downloads',authenticatemiddleware.authenticate,premiumFeatureController.showUsersDownloads);

module.exports = router;