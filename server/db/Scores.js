/* CREATE SEQUELIZE MODEL FOR DATABASE QUERYING

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import module
const config = require("../../config");
const Sequelize = require('sequelize');

// create a connection instance with my DB information.
let connection;
if (config.DATABASE_URL) {
    console.log("Connecting using database url");
    connection = new Sequelize(config.DATABASE_URL);
    console.log(connection);
}
else {
    console.log("Connecting using database details");
    connection = new Sequelize(config.DATABASE, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, config.DATABASE_OPTIONS);
    console.log(connection);
}

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
const createRecord = (name) => {
    console.log("In createRecord");
    let done = Scores.create({
        name: name,
        score: 0
    }).catch(err => {
        console.log("Error while creating record", err);
    });
    console.log("Done creating");
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