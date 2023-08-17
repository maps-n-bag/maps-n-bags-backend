module.exports = (sequelize, DataTypes) => {

  const Distance = sequelize.define('Distance', {

    first_place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'place',
        key: 'id'
      }
    },
    second_place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'place',
        key: 'id'
      }
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    journey_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    est_time: {
      type: DataTypes.FLOAT,
      allowNull: false
    }

  }, {
    underscored: true,
    tableName: 'distance',
    timestamps: false
  });

  Distance.associate = function (models) {

    Distance.belongsTo(models.Place, {
      foreignKey: 'first_place_id',
    });

    Distance.belongsTo(models.Place, {
      foreignKey: 'second_place_id',
    });

  };

  return Distance;

};