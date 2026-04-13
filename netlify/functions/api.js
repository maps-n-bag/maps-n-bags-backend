require('pg'); // ensure NFT bundler traces pg for Sequelize
const serverless = require('serverless-http');
const app = require('../../app');

module.exports.handler = serverless(app);
