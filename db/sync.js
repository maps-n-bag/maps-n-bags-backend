const db = require('../db/models');

db.sequelize.sync({
  // force: true
  // alter: true
}).then(() => {
  console.log('Database & tables created!');
  process.exit();
});