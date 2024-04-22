
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const Employee_Master = require('./employee_master');
const Asset_Master = require('./asset_master');
const Asset_Category_Master = require('./asset_category_master');
const Asset_History = require('./asset_history');
const { sequelize } = require('../config/asset_management_db');
const basename = path.basename(module.filename);

const db = {};

Employee_Master.hasMany(Asset_Master);
Asset_Master.hasMany(Asset_Category_Master);
Employee_Master.hasMany(Asset_History);
// Asset_History.hasMany(Asset_Master);
Asset_Master.hasMany(Asset_History);
sequelize.sync()
    .then(() => {
        console.log("Databse Synchronization Successfully");
        Object.keys(sequelize.models).forEach(modelName => {
            console.log(`Table Created: ${modelName}`);
        });
    })
    .catch(error => {
        console.log('Error in Synchronising database:', error);
    });
// module.exports = db;
module.exports = { Employee_Master, Asset_Master, Asset_Category_Master, Asset_History };
