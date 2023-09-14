let ispremiumuser = false;

// Function to add a new expense
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
      "http://13.51.159.108:3000/expenses/addexpense",
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

// Function to show premium user message
function showPremiumuserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user ";
  document.getElementById("message").classList.add("premium-message");
}

// Function to parse JWT token
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
  if (!token) {
    window.location.href = "/login";
    return;
  }

  // Define the parseJwt function to decode the token
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const ispremiumuser = decodeToken.ispremiumuser;
  console.log("Is Premium User:", ispremiumuser);

 
  if (ispremiumuser) {
    showPremiumuserMessage();
    // Show the button for premium users
    document.getElementById("showLeaderboardBtn").style.display = "block"; 
    document.getElementById("Reportbutton").style.display = "block"; 
    document.getElementById("download-expenses-button").style.display = "block"; 
    document.getElementById("show-old-downloads-button").style.display = "block"; 
  } else {
    // Hide features for non-premium users
    document.getElementById("showLeaderboardBtn").style.display = "none";
    document.getElementById("Reportbutton").style.display = "none";
    document.getElementById("download-expenses-button").style.display = "none";
    document.getElementById("show-old-downloads-button").style.display = "none";
  }

  getExpense(1);
});


// Pagination variables
let currentPage = 1;
let expensesPerPage = 5; // Default expenses per page

// Another event listener when the DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
  const expensesPerPageSelect = document.getElementById("expensesPerPage");

  // Retrieve saved expenses per page preference from local storage
  const savedExpensesPerPage = localStorage.getItem("expensesPerPage");
  if (savedExpensesPerPage) {
    expensesPerPage = parseInt(savedExpensesPerPage);
    expensesPerPageSelect.value = savedExpensesPerPage;
  }

  // Listen for changes in the select element
  expensesPerPageSelect.addEventListener("change", () => {
    expensesPerPage = parseInt(expensesPerPageSelect.value);
    localStorage.setItem("expensesPerPage", expensesPerPage);
    getExpense(currentPage); // Call getExpense function to fetch and display expenses
  });
});

// Function to get expenses and show pagination
async function getExpense(page) {
  const count = expensesPerPage;
  document.getElementById("listOfExpenses").innerHTML = "";

  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `http://13.51.159.108:3000/expenses/getAllExpenses/${page}?count=${count}`,
      {
        headers: { Authorization: token },
      }
    );

    response.data.expenses.forEach((element) => {
      addNewExpensetoUI(element);
    });
    showPagination(response.data);
  } catch (err) {
    // console.log(err);
    // displayMessage(JSON.stringify(err), false);
    console.log("Error occurred during GET request:", err);
    displayMessage("Failed to fetch expenses", false);
  }
}

// Function to show pagination
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
      getExpense(currentPage);
    }
  });

  nextPageBtn.addEventListener("click", async () => {
    if (hasnextpage) {
      currentPage++;
      getExpense(currentPage);
    }
  });

  pagination.appendChild(prevPageBtn);
  pagination.appendChild(currentPageElem);
  pagination.appendChild(nextPageBtn);
}

// Function to add a new expense to the UI
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

// Function to delete an expense
async function deleteExpense(e, expenseid) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    await axios.delete(
      `http://13.51.159.108:3000/expenses/deleteexpense/${expenseid}`,
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

// Function to update an expense
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
      `http://13.51.159.108:3000/expenses/updateexpense/${expenseid}`,
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

// Function to show the leaderboard
async function showLeaderboard() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      "http://13.51.159.108:3000/premium/showLeaderBoard",
      {
        headers: { Authorization: token },
      }
    );
    const userLeaderBoardArray = response.data;

    var leaderboardElem = document.getElementById("leaderboard");
    leaderboardElem.innerHTML = ""; // Clear existing content

    // Adding h2 heading with different color
    var headingElem = document.createElement("h2");
    // headingElem.textContent = "LEADERBOARD ";  //&#128081
    headingElem.innerHTML = "<br><br> &#127942 LEADERBOARD &#127942;";
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

// Function to remove an expense from the UI
function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

// Event listener for the premium membership purchase button
document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://13.51.159.108:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://13.51.159.108:3000/purchase/updatetransactionstatus",
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

// Event listener to show the leaderboard
document.getElementById("showLeaderboardBtn").addEventListener("click", () => {
  showLeaderboard();
});

// Function to handle downloading expenses
// document.getElementById("download-expenses-button").onclick = async (e) => {
//   if (ispremiumuser) {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "http://localhost:3000/premium/download-expense",
//         {
//           headers: { Authorization: token },
//         }
//       );

//       if (response.status === 200) {
//         const a = document.createElement("a");
//         a.href = response.data.fileURl;
//         a.download = "myexpenses.csv";
//         a.click();
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (errMsg) {
//       console.log(errMsg);
//       displayMessage("Failed to download expenses", false);
//     }
//   } else {
//     console.log("Non-premium user access");
//     displayMessage(
//       "You are not a premium user. Upgrade to access this feature.",
//       false
//     );
//     // Optionally show a message or take action for non-premium users
//   }
// };

// Function to handle downloading expenses
document.getElementById("download-expenses-button").onclick = async (e) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://13.51.159.108:3000/premium/download-expense",
      {
        headers: { Authorization: token },
      }
    );

    if (response.status === 200) {
      // Download the file as the user is a premium user
      const a = document.createElement("a");
      a.href = response.data.fileURl;
      a.download = "myexpenses.csv";
      a.click();
    } else {
      // Handle server response for non-premium users
      if (response.data.message === "Not a premium user") {
        displayMessage(
          "You are not a premium user. Upgrade to access this feature.",
          false
        );
      } else {
        // Handle other server errors
        console.error(response.data.message);
        displayMessage("Failed to download expenses", false);
      }
    }
  } catch (errMsg) {
    console.log(errMsg);
    displayMessage("Failed to download expenses", false);
  }
};



// Function to show previous downloads
document.getElementById("show-old-downloads-button").onclick = async (e) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://13.51.159.108:3000/premium/show-old-downloads",
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
        // previousDownloadsElement.innerHTML += "<br><h1>Previous Downloads</h1>";
        previousDownloadsElement.innerHTML +=
          '<br><br><h1 style="color: #c924c0; font-weight: bold;">&#9194; Previous Downloads &#9194;</h1>';
        response.data.prevDownloads.forEach((element) => {
          // previousDownloadsElement.innerHTML += `<li>${element.fileUrl}<button onclick="downloadFile('${element.fileUrl}')">Download</button></li>`;
          previousDownloadsElement.innerHTML += `
  <li>
    ${element.fileUrl}
    <button onclick="downloadFile('${element.fileUrl}')" style="background-color: #007bff; color: white; border: none; padding: 5px 10px; cursor: pointer;">
      Download
    </button>
  </li>`;
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
