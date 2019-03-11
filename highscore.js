/* CREATE SEQUELIZE MODEL FOR DATABASE QUERYING

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import module
const Sequelize = require('sequelize');

// create a sequelize instance with my DB information.
const sequelize = new Sequelize(process.env.DATABASE_URL);

// DEV Instance
// const sequelize = new Sequelize('asteroid_blaster', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     operatorsAliases: false,
// });

// setup User model and its fields.
let Scores = sequelize.define('scores', {
    name: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('Connected to database...'))
    .catch(error => console.log('This error occured:', error));

// export Scores model.
module.exports = { sequelize, Scores};