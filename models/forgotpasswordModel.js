const Sequelize = require('sequelize');
const sequelize =require('../util/db')

const ForgotPassword = sequelize.define('forgotpassword_tb', {
    id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,  
});

module.exports = ForgotPassword;