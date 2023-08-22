const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseController')
const userauthentication = require('../middleware/auth')


router.post('/addexpense',userauthentication.authenticate, expenseController.addexpense );

router.get('/getexpenses',userauthentication.authenticate, expenseController.getexpenses );

router.delete('/deleteexpense/:expenseid',userauthentication.authenticate, expenseController.deleteexpense);

router.put('/updateexpense/:expenseid', userauthentication.authenticate, expenseController.updateexpense);

module.exports = router;