const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const sequelize = require('../util/db');
const e = require('express');

// const getUserLeaderBoard = async (req, res) => {
//     try{
// const leaderboardofusers = await User.findAll({
//     attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
//     include: [
//         {
//             model: Expense,
//             attributes: []
//         }
//     ],
//     group:['user.id'],
//     order:[['total_cost', 'DESC']]

// })

// res.status(200).json(leaderboardofusers)

const getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll()
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {}
        console.log(expenses)
        expenses.forEach((expense) => {

            if (userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.expenseamount
            } else {
                userAggregatedExpenses[expense.userId] = expense.expenseamount;
            }

        })
        var userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0 })
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost)
        res.status(200).json(userLeaderBoardDetails)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}