/* CREATE SEQUELIZE MODEL FOR DATABASE QUERYING

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import module
const config = require("../../config");
const Sequelize = require('sequelize');

// create a connection instance with my DB information.
let connection;
if (config.DATABASE_URL) connection = new Sequelize(config.DATABASE_URL);
else connection = new Sequelize(config.DATABASE, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, config.DATABASE_OPTIONS);


// DEV Instance
// const connection = new Sequelize('asteroid_blaster', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
// });

// setup User model and its fields.
let Scores = connection.define('scores', {
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


// Create new record
const createRecord = async (name) => {
    return Scores.create({
        name: name,
        score: 0
    }).catch(err => {
        return err;
    });
}

const getHighScore = (id) => {
    return Scores.findOne({
        where:{
            id: id
        }
    }).catch(err => {
        return err;
    });
}


const getHighScores = () => {
    return Scores.findAll({
        order: [["score", "DESC"],["name", "ASC"]],
        attributes: ["name", "score"],
        limit: 10
    }).catch(err => {
        return err;
    });
}

const updateRecord = (id, score) => {
    return Scores.update({
        score: score
    },
    {
        where:{
            id: id
        }
    }).catch(err => {
        return err;
    });
}

const deleteRecord = (id) => {
    return Scores.destroy({
        where: {
            id: id
        }
    })
    .catch(err => {
        console.error(`Failed to delete ID ${client.handshake.session.user_id}`);
    });
}

// create all the defined tables in the specified database.
connection.sync()
    .then(() => console.log('Connected to database...'))
    .catch(error => console.log('This error occured:', error));

// export Scores model.
module.exports = {createRecord, getHighScore, getHighScores, updateRecord, deleteRecord};