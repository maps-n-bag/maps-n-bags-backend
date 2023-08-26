module.exports = (sequelize, DataTypes) => {

  const PlaceActivity = sequelize.define('PlaceActivity', {

    place_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'place',
        key: 'id'
      },
      primaryKey: true,
      allowNull: false,
    },

    activity_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'activity',
        key: 'id'
      },
      primaryKey: true,
      allowNull: false,
    },

    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id'
      },
      primaryKey: true,
      allowNull: false,
    },

    est_cost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    }

  }, {
    underscored: true,
    tableName: 'place_activity',
    timestamps: false
  });

  // PlaceActivity.associate = function(models) {
  //   PlaceActivity.belongsTo(models.Place, { foreignKey: 'place_id' });
  //   PlaceActivity.belongsTo(models.Activity, { foreignKey: 'activity_id' });
  //   PlaceActivity.belongsTo(models.Tag, { foreignKey: 'tag_id' });
  // };

  return PlaceActivity;

};