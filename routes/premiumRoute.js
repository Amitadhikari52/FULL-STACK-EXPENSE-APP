const express = require('express');

const authenticatemiddleware = require('../middleware/auth');

const premiumFeatureController = require('../controllers/premiumController');

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);


module.exports = router;