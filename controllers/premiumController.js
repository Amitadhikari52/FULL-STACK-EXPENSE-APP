const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const sequelize = require('../util/db');
const e = require('express');


const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardofusers = await User.findAll({
            attributes: [ 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
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


module.exports = {
    getUserLeaderBoard
}