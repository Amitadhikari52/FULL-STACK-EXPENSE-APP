const path = require('path');
const fs = require("fs");
const express = require('express');
const cors = require('cors');
const sequelize = require('./util/db');
const dotenv = require('dotenv');

const helmet = require("helmet");
const compression = require('compression');
const morgan = require("morgan");


const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Order = require('./models/ordersModel');
const Forgotpassword = require('./models/forgotpasswordModel');
const DownloadedReports = require('./models/downloadedReportsModel');


const userRoutes = require('./routes/userRoute'); 
const expenseRoutes = require('./routes/expenseRoute')
const purchaseRoutes = require('./routes/purchaseRoute')
const premiumFeatureRoutes = require('./routes/premiumRoute')
const resetPasswordRoutes = require('./routes/passwordRoute');
const reportsRoutes = require('./routes/reportsRouter');
const app = express();


// get config vars
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(compression());

//log file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"),{ flags: "a" });

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password',resetPasswordRoutes);
app.use("/reports", reportsRoutes);


// app.use((req,res) => {
//   console.log('urlll', req.url);
//   res.sendFile(path.join(__dirname, `public/${req.url}`));
// })


// Serve main dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve login page
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/Login','login.html'))
});


// Serve signup page
app.get('/signup',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/Signup','signup.html'))
});

// Serve expenses page
app.get('/expenses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Home', 'expense.html'));
});

// Serve reports page
app.get('/reports', (req, res ) => {
  res.sendFile(path.join(__dirname, 'public/ReportGeneration', 'report.html'));
});


// Define associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadedReports);
DownloadedReports.belongsTo(User);


// Start server after syncing with database

sequelize.sync()
    .then(()=>{ app.listen(process.env.PORT || 3000) })
    .catch(err=>console.log("error in connection..",err))
