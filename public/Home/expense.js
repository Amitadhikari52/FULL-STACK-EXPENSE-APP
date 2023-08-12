async function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseamount: e.target.expenseamount.value,
    description: e.target.description.value,
    category: e.target.category.value,
    // userId : 1 
  };

  console.log(expenseDetails)
  const token = localStorage.getItem('token')
  try {
    const response = await axios.post('http://localhost:3000/expenses/addexpense', expenseDetails, {headers:{"Authorization" : token}});
    addNewExpensetoUI(response.data.expense);
  } catch (err) {
    showError(err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get('http://localhost:3000/expenses/getexpenses', { headers: { Authorization: token } });
    response.data.expenses.forEach((expense) => {
      addNewExpensetoUI(expense);
    });
  } catch (err) {
    showError(err);
  }
});

function addNewExpensetoUI(expense) {
  const parentElement = document.getElementById('listOfExpenses');
  const expenseElemId = `expense-${expense.id}`;
  parentElement.innerHTML += `
  <tr id="${expenseElemId}">
  <td>${expense.expenseamount}</td>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>${expense.createdAt}</td>
    <td>
        <button onclick="deleteExpense(event, ${expense.id})">Delete Expense</button>
    </td>
    </tr>`;
}

async function deleteExpense(e, expenseid) {
  e.preventDefault();
  const token = localStorage.getItem('token')

  try {
    await axios.delete(`http://localhost:3000/expenses/deleteexpense/${expenseid}`, {headers:{"Authorization" : token}}); // Change URL here
    removeExpensefromUI(expenseid);
  } catch (err) {
    showError(err);
  }
}
function showError(err) {
  console.error(err);
}

function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

 
// async function updateExpense(e, expenseid) {
//   e.preventDefault();

//   const expenseDetails = {
//     expenseamount: e.target.expenseamount.value,
//     description: e.target.description.value,
//     category: e.target.category.value,
//   };

//   try {
//     const response = await axios.put(`http://localhost:3000/expenses/updateexpense/${expenseid}`, expenseDetails);
//     updateExpenseInUI(response.data.expense);
//   } catch (err) {
//     showError(err);
//   }
// }

// function updateExpenseInUI(expense) {
//   const expenseElemId = `expense-${expense.id}`;
//   const expenseElem = document.getElementById(expenseElemId);
//   if (expenseElem) {
//     const expenseDetailsElem = expenseElem.querySelector('td:nth-child(1)');
//     const descriptionElem = expenseElem.querySelector('td:nth-child(2)');
//     const categoryElem = expenseElem.querySelector('td:nth-child(3)');

//     expenseDetailsElem.textContent = expense.expenseamount;
//     descriptionElem.textContent = expense.description;
//     categoryElem.textContent = expense.category;
//   }
// }
