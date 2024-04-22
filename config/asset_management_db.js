const Sequelize = require('sequelize');

const sequelize = new Sequelize('work', 'postgres', 'Deva@1234', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => {
        console.log('Database Connection Established Successfully');
    })
    .catch(error => {
        console.error('Unable to connect the database:', error);
    });
module.exports = { sequelize };