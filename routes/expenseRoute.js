const express = require('express');

const expenseController = require('../controllers/expenseController')
const userauthentication = require('../middleware/auth')


const router = express.Router();


router.post('/addexpense',userauthentication.authenticate, expenseController.addexpense );

router.get('/getexpenses',userauthentication.authenticate, expenseController.getexpenses );

router.delete('/deleteexpense/:expenseid',userauthentication.authenticate, expenseController.deleteexpense);

// router.put('/updateexpense/:expenseid', expenseController.updateexpense); 

module.exports = router;