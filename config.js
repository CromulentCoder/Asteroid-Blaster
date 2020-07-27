let config = {};

config.PORT = process.env.PORT || 3000;
config.VIEW_PATH = "./public/views";
config.SECRET = process.env.SECRET || "Hi there you... Looking for my secret?";

config.DATABASE_URL = process.env.DATABASE_URL || null;
config.DATABASE = "asteroid_blaster";
config.DATABASE_USERNAME = "root";
config.DATABASE_PASSWORD = "";
config.DATABASE_OPTIONS = {host: 'localhost',dialect: 'mysql'};

config.ENV = process.env.ENV || null;
module.exports = config;