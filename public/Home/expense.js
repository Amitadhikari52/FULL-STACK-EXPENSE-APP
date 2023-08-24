let ispremiumuser = false;

async function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseamount: e.target.expenseamount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };

  console.log(expenseDetails);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:3000/expenses/addexpense",
      expenseDetails,
      {
        headers: { Authorization: token },
      }
    );
    addNewExpensetoUI(response.data.expense);
  } catch (err) {
    showError(err);
  }
}

function showPremiumuserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user ";
  document.getElementById("message").classList.add("premium-message");
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  ispremiumuser = decodeToken.ispremiumuser;
  console.log("Is Premium User:", ispremiumuser);
  if (ispremiumuser) {
    showPremiumuserMessage();
    // showLeaderboard();
    document.getElementById("showLeaderboardBtn").style.display = "block"; // Show the button for premium users

    try {
      const response = await axios.get(
        "http://localhost:3000/expenses/getexpenses",
        {
          headers: { Authorization: token },
        }
      );
      response.data.expenses.forEach((expense) => {
        addNewExpensetoUI(expense);
      });

      // Fetch and display expenses on initial page load
      getExpense(currentPage);
    } catch (err) {
      showError(err);
    }
  }
});

let currentPage = 1; // Declare and initialize currentPage
let expensesPerPage = 10; // Default value

// Function to fetch expenses based on the current page and expenses per page
async function getExpense(page) {
  const count = localStorage.getItem("count");
  document.getElementById("list").innerHTML = "";

  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `http://localhost:3000/get-all-expenses?page=${page}&count=${expensesPerPage}`,
      {
        headers: { authorization: token },
      }
    );

    response.data.rows.forEach((element) => {
      showExpenseOnScreen(element);
    });

    showPagination(response.data);
  } catch (err) {
    console.log(err);
    displayMessage(JSON.stringify(err), false);
  }
}

// Function to update expensesPerPage and retrieve expenses for the current page
async function updateExpenses() {
  expensesPerPage = parseInt(document.getElementById("expensesPerPage").value);
  await getExpense(currentPage);
}

async function showPagination({
  currentpage,
  nextpage,
  previouspage,
  hasnextpage,
  haspreviouspage,
  lastpage,
}) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevPageBtn = document.createElement("button");
  prevPageBtn.innerHTML = "Previous";
  prevPageBtn.classList.add("btn", "btn-primary");
  prevPageBtn.disabled = !haspreviouspage;

  const nextPageBtn = document.createElement("button");
  nextPageBtn.innerHTML = "Next";
  nextPageBtn.classList.add("btn", "btn-primary");
  nextPageBtn.disabled = !hasnextpage;

  const currentPageElem = document.createElement("span");
  currentPageElem.id = "currentPage";
  currentPageElem.textContent = currentpage;

  prevPageBtn.addEventListener("click", async () => {
    if (haspreviouspage) {
      currentPage--;
      await getExpense(currentPage);
    }
  });

  nextPageBtn.addEventListener("click", async () => {
    if (hasnextpage) {
      currentPage++;
      await getExpense(currentPage);
    }
  });

  pagination.appendChild(prevPageBtn);
  pagination.appendChild(currentPageElem);
  pagination.appendChild(nextPageBtn);
}

// Update the select element and fetch expenses based on the selected value
document.getElementById("expensesPerPage").addEventListener("change", updateExpenses);

// Initial call to fetch expenses based on the default expensesPerPage
updateExpenses();



function addNewExpensetoUI(expense) {
  const parentElement = document.getElementById("listOfExpenses");
  const expenseElemId = `expense-${expense.id}`;
  parentElement.innerHTML += `
  <tr id="${expenseElemId}">
    <td>${expense.expenseamount}</td>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>${expense.createdAt}</td>
    <td>
      <button onclick="deleteExpense(event, ${expense.id})">
      <i class="fas fa-trash" style="color: red;"></i> <!-- Font Awesome trash icon -->
      </button>
      <button onclick="openUpdateForm(event, ${expense.id})">
      <i class="fas fa-edit" style="color: blue;"></i> <!-- Font Awesome edit icon -->
    </button>
    </td>
  </tr>`;
}

async function deleteExpense(e, expenseid) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    await axios.delete(
      `http://localhost:3000/expenses/deleteexpense/${expenseid}`,
      {
        headers: { Authorization: token },
      }
    );
    removeExpensefromUI(expenseid);
  } catch (err) {
    showError(err);
  }
}
function showError(err) {
  console.error(err);
}

// Function to open the update form
function openUpdateForm(e, expenseid) {
  e.preventDefault();
  const expenseRow = document.getElementById(`expense-${expenseid}`);
  const updateForm = `
    <form onsubmit="updateExpense(event, ${expenseid})" class="mb-4">
      <div class="form-group">
        <label for="updatedExpenseAmount">Updated Expense Amount:</label>
        <input type="number" class="form-control" name="updatedExpenseAmount" required>
      </div>
      <div class="form-group">
        <label for="updatedDescription">Updated Description:</label>
        <input type="text" class="form-control" name="updatedDescription" required>
      </div>
      <div class="form-group">
        <label for="updatedCategory">Updated Category:</label>
        <select class="form-control" id="updatedCategory" name="updatedCategory">
          <option selected>Choose category</option>
          <option value="fuel">Fuel</option>
          <option value="food">Food</option>
          <option value="utilities">Utilities</option>
          <option value="housing">Housing</option>
          <option value="entertainment">Entertainment</option>
          <option value="movie">Movie</option>
          <option value="education">Education</option>
          
        </select>
      </div>
      <button class="btn btn-primary">Update Expense</button>
    </form>
  `;
  expenseRow.innerHTML = `<td colspan="5">${updateForm}</td>`;
}

async function updateExpense(e, expenseid) {
  e.preventDefault();
  const { updatedExpenseAmount, updatedDescription, updatedCategory } =
    e.target;
  const updatedExpenseDetails = {
    expenseamount: updatedExpenseAmount.value,
    description: updatedDescription.value,
    category: updatedCategory.value,
  };
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `http://localhost:3000/expenses/updateexpense/${expenseid}`,
      updatedExpenseDetails,
      { headers: { Authorization: token } }
    );
    const expenseRow = document.getElementById(`expense-${expenseid}`);
    const expenseDetails = response.data.expense;
    expenseRow.innerHTML = `
      <td>${expenseDetails.expenseamount}</td>
      <td>${expenseDetails.description}</td>
      <td>${expenseDetails.category}</td>
      <td>${expenseDetails.createdAt}</td>
      <td>
        <button onclick="deleteExpense(event, ${expenseid})">
          <i class="fas fa-trash" style="color: red;"></i>
        </button>
        <button onclick="openUpdateForm(event, ${expenseid})">
          <i class="fas fa-edit" style="color: blue;"></i>
        </button>
      </td>
    `;
  } catch (err) {
    showError(err);
  }
}

async function showLeaderboard() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showLeaderBoard",
      {
        headers: { Authorization: token },
      }
    );
    const userLeaderBoardArray = response.data;

    var leaderboardElem = document.getElementById("leaderboard");
    leaderboardElem.innerHTML = ""; // Clear existing content

    // Adding h2 heading with different color
    var headingElem = document.createElement("h2");
    headingElem.textContent = "Leader Board";

    leaderboardElem.appendChild(headingElem);

    // Creating the leaderboard table
    var tableElem = document.createElement("table");
    tableElem.innerHTML = `
        <th>Sn</th>
        <th>Name</th>
        <th>Total Expense</th>
    `;

    userLeaderBoardArray.forEach((userDetails, index) => {
      var rowElem = document.createElement("tr");

      var serialNumberCell = document.createElement("td");
      serialNumberCell.textContent = index + 1; // Display serial numbers
      rowElem.appendChild(serialNumberCell);

      var nameCell = document.createElement("td");
      nameCell.textContent = userDetails.name;
      rowElem.appendChild(nameCell);

      var expenseCell = document.createElement("td");
      expenseCell.textContent = userDetails.total_cost || 0;
      rowElem.appendChild(expenseCell);

      tableElem.appendChild(rowElem);
    });

    leaderboardElem.appendChild(tableElem);
  } catch (error) {
    console.error(error);
  }
}

function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert("You are a Premium User Now");
      document.getElementById("rzp-button1").style.visibility = "hidden";
      document.getElementById("message").innerHTML = "You are a premium user ";
      localStorage.setItem("token", res.data.token);
      showLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Something went wrong");
  });
};

document.getElementById("showLeaderboardBtn").addEventListener("click", () => {
  showLeaderboard();
});

// Function to handle downloading expenses
document.getElementById("download-expenses-button").onclick = async (e) => {
  if (ispremiumuser) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/premium/download-expense",
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        const a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpenses.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    } catch (errMsg) {
      console.log(errMsg);
      displayMessage("Failed to download expenses", false);
    }
  } else {
    console.log("Non-premium user access");
    displayMessage(
      "You are not a premium user. Upgrade to access this feature.",
      false
    );
    // Optionally show a message or take action for non-premium users
  }
};

// Function to show previous downloads
document.getElementById("show-old-downloads-button").onclick = async (e) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/premium/show-old-downloads",
      {
        headers: { Authorization: token },
      }
    );

    if (response.status === 200) {
      const previousDownloadsElement =
        document.getElementById("previous-downloads");
      previousDownloadsElement.innerHTML = ""; // Clear existing content
      if (
        response.data.prevDownloads &&
        response.data.prevDownloads.length > 0
      ) {
        previousDownloadsElement.innerHTML += "<h1>Previous Downloads</h1>";

        response.data.prevDownloads.forEach((element) => {
          previousDownloadsElement.innerHTML += `<li>${element.fileName}<button onclick="downloadFile('${element.fileURL}')">Download</button></li>`;
        });
      } else {
        previousDownloadsElement.innerHTML +=
          "<p>No previous downloads available.</p>";
      }
    } else {
      throw new Error(response.data.message);
    }
  } catch (errMsg) {
    console.log(errMsg);
    displayMessage("Failed to fetch previous downloads", false);
  }
};

// Function to download a specific file
function downloadFile(fileURL) {
  const a = document.createElement("a");
  a.href = fileURL;
  a.download = "myexpense.csv";
  a.click();
}

// Function to display success or failure messages
function displayMessage(msg, successOrFailure) {
  const errorDiv = document.getElementById("message");
  errorDiv.innerHTML = "";

  if (successOrFailure) {
    errorDiv.innerHTML += `<h2 style="text-align:center; color:green; margin-top:30px;">${msg}</h2>`;
  } else {
    errorDiv.innerHTML += `<h2 style="text-align:center; color:red; margin-top:30px;">${msg}</h2>`;
  }
}
