const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");

const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");

const logoutBtn = document.getElementById("logoutBtn");

async function getDailyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const date = new Date(dateInput.value);

    // const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
    //   date.getMonth() + 1
    // )
    //   .toString()
    //   .padStart(2, "0")}-${date.getFullYear()}`;

    // Use ISO format for dates
    // const formattedDate = date.toISOString().slice(0, 10);
    // const formattedDate = date.toISOString().split("T")[0];
    // const formattedDate = date.toISOString();
    const formattedDate = date.toISOString().split("T")[0]; // For daily report



    let totalAmount = 0;
    const res = await axios.post(
      // "http://13.51.159.108:3000/reports/dailyReports",
      "http://localhost:3000/reports/dailyReports",
      {
        date: formattedDate,
      },
      { headers: { Authorization: token } }
    );

    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.expenseamount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.expenseamount));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.description));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.category));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.createdAt));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

async function getMonthlyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const month = new Date(monthInput.value);

    // const formattedMonth = `${(month.getMonth() + 1)
    //   .toString()
    //   .padStart(2, "0")}`;

    // const formattedMonth = month.toISOString().split("T")[0];

    // const formattedMonth = month.toISOString();
    const formattedMonth = month.toISOString().slice(0, 7); // For monthly report


    let totalAmount = 0;
    const res = await axios.post(
      // "http://13.51.159.108:3000/reports/monthlyReports",
      "http://localhost:3000/reports/monthlyReports",
      {
        month: formattedMonth,
      },
      { headers: { Authorization: token } }
    );

    tbodyMonthly.innerHTML = "";
    tfootMonthly.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.expenseamount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyMonthly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.expenseamount));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.description));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.category));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.createdAt));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootMonthly.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "monthlyTotal");
    td4.setAttribute("id", "monthlyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

dateShowBtn.addEventListener("click", getDailyReport);
monthShowBtn.addEventListener("click", getMonthlyReport);
logoutBtn.addEventListener("click", logout);
