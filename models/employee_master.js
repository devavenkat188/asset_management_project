const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/asset_management_db');

// const Asset_Master = require('./asset_master');

const Employee = sequelize.define("Employee", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    designation: {
        type: DataTypes.STRING,
    },
    dob: {
        type: DataTypes.DATE
    },
    mobile: {
        type: DataTypes.BIGINT,
    },
    email: {
        type: DataTypes.STRING,
    },
    branch: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.INTEGER,
    },
}, {
    // tableName: "Employee_Master",
    timestamps: false,
});

// return Employee_Master;
module.exports = Employee;


/*sequelize.sync({ force: true });
console.log('Employee_Master Table Created');
console.log(typeof Employee_Master); // Check the type of Employee_Master
console.log(Employee_Master instanceof Sequelize.Model); // Check if Employee_Master is an instance of Sequelize.Model
*/


/*
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../../config/asset_management_db');
const Asset_Master = require('./asset_master'); // Import Asset_Master model

const Employee_Master = sequelize.define("employee_master", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    Employee_Name: {
        type: DataTypes.TEXT,
    },
    Designation: {
        type: DataTypes.TEXT,
    },
    DOB: {
        type: DataTypes.DATE
    },
    Mobile_Number: {
        type: DataTypes.BIGINT,
    },
    Salary: {
        type: DataTypes.INTEGER,
    },
    Experience: {
        type: DataTypes.INTEGER,
    },
    Status: {
        type: DataTypes.TEXT,
    },
},{
    tableName: "Employee_Master",
    timestamps: false,
});

// Define associations
Employee_Master.hasMany(Asset_Master); // Define the association with Asset_Master

sequelize.sync({ force: true });
console.log('Employee_Master Table Created');
module.exports = Employee_Master;
*/

/*
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../../config/asset_management_db');
const Asset_Master = require('./asset_master');
const Employee_Master = sequelize.define("employee_master", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        /* references: {
            model: 'Asset_Master',
            key: 'Asset_id',
        }, */
/* },
 Employee_Name: {
     type: DataTypes.TEXT,
 },
 Designation: {
     type: DataTypes.TEXT,
 },
 DOB: {
     type: DataTypes.DATE
 },
 Mobile_Number: {
     type: DataTypes.BIGINT,
 },
 Salary: {
     type: DataTypes.INTEGER,
 },
 Experience: {
     type: DataTypes.INTEGER,
 },
 Status: {
     type: DataTypes.TEXT,
 },
},{
 tableName: "Employee_Master",
 timestamps: false,
});

// Data initialization:

// Employee_Master.associate = function(models) {
 // Employee_Master.hasMany(Asset_Master);
// } 
/*Employee_Master.hasOne(Asset_Master, {
 foreignKey: 'id',
}); */
/*
Employee_Master.hasMany(Asset_Master);
sequelize.sync({ force: true });
console.log('Employee_Master Table Created');
module.exports = Employee_Master;

*/