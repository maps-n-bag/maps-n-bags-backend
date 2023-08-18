const db = require('../db/models');

db.sequelize.sync({
  alter: true
}).then(() => {
  console.log('Database & tables created!');
  process.exit();
});