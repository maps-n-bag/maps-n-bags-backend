const db = require('../db/models');

db.sequelize.sync({
  // force: true
}).then(() => {
  console.log('Database & tables created!');
  process.exit();
});