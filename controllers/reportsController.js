const path = require("path");
const { Op } = require("sequelize"); // Import Op object
// const moment = require('moment');
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/db");

const getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "public/ReportGeneration", "report.html"));
};

const dailyReports = async (req, res, next) => {
  try {
    const formattedDate = new Date(req.body.date); // Parse date here
    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            formattedDate,
            new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000),
          ], // For daily report (24 hours range)
        },
        userId: req.user.id,
      },
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const monthlyReports = async (req, res, next) => {
  try {
    const formattedMonth = new Date(req.body.month); // Parse month here
    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            formattedMonth,
            new Date(
              formattedMonth.getFullYear(),
              formattedMonth.getMonth() + 1,
              0
            ),
          ], // For monthly report (entire month range)
        },
        userId: req.user.id,
      },
      raw: true,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getReportsPage,
  dailyReports,
  monthlyReports,
};
