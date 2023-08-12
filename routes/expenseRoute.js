const express = require('express');

const expenseController = require('../controllers/expenseController')
const userauthentication = require('../middleware/auth')


const router = express.Router();


router.post('/addexpense', expenseController.addexpense );

router.get('/getexpenses', expenseController.getexpenses );

router.delete('/deleteexpense/:expenseid', expenseController.deleteexpense);

// router.put('/updateexpense/:expenseid', expenseController.updateexpense); 

module.exports = router;