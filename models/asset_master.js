
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/asset_management_db');
//const Employee_Master = require('./employee_master');
//const Asset_Category_Master = require('./asset_category_master');

const Asset_Master = sequelize.define("AssetMaster", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    serialNumber: {
        type: DataTypes.INTEGER,
        unique: true,
    },
    assetName: {
        type: DataTypes.STRING,
    },
    make: {
        type: DataTypes.STRING,
    },
    model: {
        type: DataTypes.STRING,
    },
    cost: {
        type: DataTypes.FLOAT,
    },
    status: {
        type: DataTypes.INTEGER,
    }
},{
    // tableName: "Asset_Master",
    timestamps: false,
});
// return Asset_Master;     
module.exports = Asset_Master;

// Association setup
/*Asset_Master.associate = function(models){
Asset_Master.belongsTo(Employee_Master);
Asset_Master.hasMany(Asset_Category_Master);
}*/
//sequelize.sync({ force: true });
// console.log('Asset_Master Table Created');


/*
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../../config/asset_management_db');
const Employee_Master = require('./employee_master');
const Asset_Category_Master = require('./asset_category_master');

const Asset_Master = sequelize.define("asset_master", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    Serial_Number: {
        type: DataTypes.INTEGER,
    },
    Asset_Name: {
        type: DataTypes.TEXT,
    },
    Model: {
        type: DataTypes.TEXT,
    },
    Make: {
        type: DataTypes.TEXT,
    },
    Asset_Cost: {
        type: DataTypes.INTEGER,
    },
    Asset_total: {
        type: DataTypes.INTEGER,
    },
},{
    tableName: "Asset_Master",
    timestamps: false,
});

// Association with Employee_Master: Each asset belongs to an employee
Asset_Master.belongsTo(Employee_Master);

// Association with Asset_Category_Master: Each asset can have multiple categories
Asset_Master.hasMany(Asset_Category_Master);

sequelize.sync({ force: true });
console.log('Asset_Master Table Created');
module.exports = Asset_Master;
*/

/*
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../../config/asset_management_db');
const Employee_Master = require('./employee_master');
const Asset_Category_Master = require('./asset_category_master');
const Asset_Master = sequelize.define("asset_master", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        /*references: {
            model: "Asset_Category",
            key: 'Asset_Category_id',
        } */
   /* },
    Serial_Number: {
        type: DataTypes.INTEGER,
    },
    Asset_Name: {
        type: DataTypes.TEXT,
    },
    Model: {
        type: DataTypes.TEXT,
    },
    Make: {
        type: DataTypes.TEXT,
    },
    Asset_Cost: {
        type: DataTypes.INTEGER,
    },
    Asset_total: {
        type: DataTypes.INTEGER,
    },
},{
    tableName: "Asset_Master",
    timestamps: false,
});

// Asset_Master.associate = function(models) {
    //
// }
Asset_Master.belongsTo(Employee_Master);
Asset_Master.hasMany(Asset_Category_Master);
 

sequelize.sync({ force: true });
console.log('Asset_Master Table Created');
module.exports = Asset_Master;
*/