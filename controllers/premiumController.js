const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const sequelize = require('../util/db');
const Downloads = require('../models/downloadedReportsModel');
const e = require('express');
const UserServices = require('../services/userservices')
const S3Service = require('../services/S3services')


const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardofusers = await User.findAll({
      attributes: ['name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
      include: [
        {
          model: Expense,
          attributes: []
        }
      ],
      group: ['users.id'], // Corrected from 'user.id' to 'users.id'
      order: [[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'DESC']] // Order by the sum of expenseamount
      // order: [['total_cost','DESC']]
    })

    res.status(200).json(leaderboardofusers)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const downloadexpense = async (req, res) => {
  try {
    const expenses = await UserServices.getExpenses(req);
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    //it should depend upon userId 
    const userId = req.user.id;

    // const filename = 'Expense.txt';
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURl = await S3Service.uploadToS3(stringifiedExpenses, filename);
    console.log(fileURl);
    res.status(200).json({ fileURl, success: true })
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURl: '', success: false, err: err })

  }

}

const showUsersDownloads = async (req, res) => {
  try {
    // const usersTbId = req.user.userId;
    // const prevDownloads = await Downloads.findAll({where:{usersTbId}})
    // if(prevDownloads){
      
    // Get the user ID from the authenticated user
    const userId = req.user.id; // Assuming your User model has a field named 'id'

    // Fetch previous downloads based on the user's ID
    const prevDownloads = await Downloads.findAll({ where: { userId } });

    if (prevDownloads.length > 0) {
      return res.status(200).json({ prevDownloads, success: true });
    } else {
      return res.json({ message: "No previous Downloads..", success: false });
    }
  } catch (err) {
    console.log("Error in fetching previous Downloads data, error: ", err);
    res.status(500).json({ message: "Failed to fetch previous downloads", success: false });
  }
}




module.exports = {
  getUserLeaderBoard,
  downloadexpense,
  showUsersDownloads
}