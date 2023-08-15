module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {});
  // Test.associate = function(models) {
  //   // associations can be defined here
  // };
  return Test;
};