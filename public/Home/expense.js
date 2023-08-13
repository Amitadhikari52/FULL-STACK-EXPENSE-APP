async function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseamount: e.target.expenseamount.value,
    description: e.target.description.value,
    category: e.target.category.value,

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

function showPremiumuserMessage() {
  document.getElementById('rzp-button1').style.visibility = "hidden"
  document.getElementById('message').innerHTML = "You are a premium user "
  document.getElementById('message').classList.add('premium-message');
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  console.log(decodeToken)
  const ispremiumuser = decodeToken.ispremiumuser
  if(ispremiumuser){
      showPremiumuserMessage()
      // showLeaderboard()
  try {
    const response = await axios.get('http://localhost:3000/expenses/getexpenses', { headers: { Authorization: token } });
    response.data.expenses.forEach((expense) => {
      addNewExpensetoUI(expense);
    });
  } catch (err) {
    showError(err);
  }
}});

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

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         document.getElementById('message').classList.add('premium-message');
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}
 
