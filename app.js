const express = require('express');
const cors = require('cors');
const sequelize = require('./util/db');
const userRoutes = require('./routes/userRoute'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);

sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('Database synchronization error:', err);
  });
