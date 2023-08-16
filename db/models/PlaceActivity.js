module.exports = (sequelize, DataTypes) => {

  const PlaceActivity = sequelize.define('PlaceActivity', {

    est_cost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    }

  }, {});

  PlaceActivity.associate = function(models) {
    PlaceActivity.belongsTo(models.Place, { foreignKey: 'place_id' });
    PlaceActivity.belongsTo(models.Activity, { foreignKey: 'activity_id' });
    PlaceActivity.belongsTo(models.Tag, { foreignKey: 'tag_id' });
  };

  return PlaceActivity;

};