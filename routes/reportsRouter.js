const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const userAuthentication = require("../middleware/auth"); // Import your authentication middleware

router.get("/getReportsPage", reportsController.getReportsPage);
router.post("/dailyReports", userAuthentication.authenticate, reportsController.dailyReports);
router.post("/monthlyReports", userAuthentication.authenticate, reportsController.monthlyReports);

module.exports = router;
