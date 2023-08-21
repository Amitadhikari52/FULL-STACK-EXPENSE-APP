const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./util/db');
const dotenv = require('dotenv');


const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Order = require('./models/ordersModel');
const Forgotpassword = require('./models/forgotpasswordModel');


const userRoutes = require('./routes/userRoute'); 
const expenseRoutes = require('./routes/expenseRoute')
const purchaseRoutes = require('./routes/purchaseRoute')
const premiumFeatureRoutes = require('./routes/premiumRoute')
const resetPasswordRoutes = require('./routes/passwordRoute');
const app = express();


// get config vars
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password',resetPasswordRoutes);


// Serve main dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve main dashboard page
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/login','login.html'))
});


// Serve signup page
app.get('/signup',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/Signup','signup.html'))
});

// Serve expenses page
app.get('/expenses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Home', 'expense.html'));
});


// Define associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


// Start server after syncing with database
sequelize.sync({ alter: false })
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('Database synchronization error:', err);
  });

