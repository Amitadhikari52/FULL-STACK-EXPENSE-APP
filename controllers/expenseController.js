const Expense = require('../models/expenseModel');

const addexpense = async (req, res) => {
  const { expenseamount, description, category } = req.body;

  if (!expenseamount) {
    return res.status(400).json({ success: false, message: 'Expense amount is missing' });
  }

  try {
    const expense = await Expense.create({ expenseamount, description, category });
    return res.status(201).json({ expense, success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

const getexpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll()
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

  try {
    await Expense.destroy({ where: { id: expenseid } });
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};

// const updateexpense = async (req, res) => {
//   const expenseid = req.params.expenseid;
//   const { expenseamount, description, category } = req.body;

//   if (!expenseamount) {
//     return res.status(400).json({ success: false, message: 'Expense amount is missing' });
//   }

//   try {
//     const expense = await Expense.findByPk(expenseid);
//     if (!expense) {
//       return res.status(404).json({ success: false, message: 'Expense not found' });
//     }

//     expense.expenseamount = expenseamount;
//     expense.description = description;
//     expense.category = category;
//     await expense.save();

//     return res.status(200).json({ expense, success: true });
//   } catch (err) {
//     return res.status(500).json({ success: false, error: err });
//   }
// };

module.exports = {
  deleteexpense,
  getexpenses,
  addexpense,
  // updateexpense, 
};
