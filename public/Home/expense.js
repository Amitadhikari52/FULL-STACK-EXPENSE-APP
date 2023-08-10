function addNewExpense(e) {
    e.preventDefault();
  
    const expenseDetails = {
      expenseamount: e.target.expenseamount.value,
      description: e.target.description.value,
      category: e.target.category.value,
    };
  
    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:3000/expense/addexpense', expenseDetails, {
        headers: { Authorization: token },
      })
      .then((response) => {
        addNewExpensetoUI(response.data.expense);
      })
      .catch((err) => showError(err)); // Call showError function to display error
  }
  
  function editExpense(expenseid) {
    // Implement edit functionality here
    console.log(`Editing expense with ID: ${expenseid}`);
  }
  
  function deleteExpense(expenseid) {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        removeExpensefromUI(expenseid);
      })
      .catch((err) => showError(err)); // Call showError function to display error
  }
  
  function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    const editButton = `<button onclick='editExpense(${expense.id})'>Edit</button>`;
    const deleteButton = `<button onclick='deleteExpense(${expense.id})'>Delete</button>`;
    parentElement.innerHTML += `
      <li id=${expenseElemId} class="expense-item">
          <div class="expense-item-description">
              ${expense.expenseamount} - ${expense.category} - ${expense.description}
          </div>
          <div class="expense-item-actions">
              ${editButton} ${deleteButton}
          </div>
      </li>`;
  }
  
  function removeExpensefromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
  }
  
  function showError(err) {
    // Display the error message in the message div
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div style="color: red;">${err}</div>`;
  }
  
  // Other functions remain unchanged
  
  // DOMContentLoaded event listener
  window.addEventListener('DOMContentLoaded', () => {
    // ... (Other code remains unchanged)
  });
  