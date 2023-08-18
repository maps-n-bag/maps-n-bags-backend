module.exports = (sequelize, DataTypes) => {

  const PlaceActivity = sequelize.define('PlaceActivity', {

    place_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'place',
        key: 'id'
      },
      primaryKey: true
    },

    activity_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'activity',
        key: 'id'
      },
      primaryKey: true
    },

    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id'
      },
      primaryKey: true
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

  PlaceActivity.associate = function(models) {

  };

  return PlaceActivity;

};