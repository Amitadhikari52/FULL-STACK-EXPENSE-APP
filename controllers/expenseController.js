const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const sequelize = require('../util/db');
const UserServices = require('../services/userservices')
const S3Service = require('../services/S3services')


const addexpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { expenseamount, description, category } = req.body;

  if (expenseamount == undefined || expenseamount.length === 0) {
    return res.status(400).json({ success: false, message: 'Expense amount is missing' });
  }

  try {
    const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id }, { transaction: t });
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);

    await User.update({
      totalExpenses: totalExpense
    }, {
      where: { id: req.user.id },
      transaction: t
    });

    await t.commit();
    res.status(200).json({ expense: expense });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};


const getexpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } })
    return res.status(200).json({ expenses, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err, success: false });
  }
};



const deleteexpense = async (req, res) => {
  const expenseid = req.params.expenseid;
  if (!expenseid) {
    return res.status(400).json({ success: false, message: 'Expense ID is missing' });
  }

  const t = await sequelize.transaction();

  try {
    const deletedExpense = await Expense.findOne({
      where: { id: expenseid, userId: req.user.id }
    });

    if (!deletedExpense) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const deletedExpenseAmount = deletedExpense.expenseamount;

    await deletedExpense.destroy({ transaction: t });

    const user = await User.findByPk(req.user.id, { transaction: t });
    const updatedTotalExpenses = user.totalExpenses - deletedExpenseAmount;

    await user.update({ totalExpenses: updatedTotalExpenses }, { transaction: t });

    await t.commit();

    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};


const updateexpense = async (req, res) => {
  const expenseid = req.params.expenseid;
  const { expenseamount, description, category } = req.body;

  if (!expenseamount) {
    return res.status(400).json({ success: false, message: 'Expense amount is missing' });
  }

  try {
    const expense = await Expense.findByPk(expenseid);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    expense.expenseamount = expenseamount;
    expense.description = description;
    expense.category = category;
    await expense.save();

    return res.status(200).json({ expense, success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

module.exports = {
  deleteexpense,
  getexpenses,
  addexpense,
  updateexpense,
};
