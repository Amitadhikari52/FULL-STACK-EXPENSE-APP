const Sequelize = require("sequelize");
const sequelize = require("../util/db");
const User = require("./userModel");

const DownloadedReports = sequelize.define("downloadedReports_tb", {
  fileUrl: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = DownloadedReports;
