module.exports = (sequelize, DataTypes) => {

  const Distance = sequelize.define('Distance', {

    first_place_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'place',
        key: 'id'
      },
      primaryKey: true,
    },
    second_place_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'place',
        key: 'id'
      },
      primaryKey: true,
    },
    journey_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distance: {
      type: DataTypes.FLOAT,
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
      onDelete: 'CASCADE',
    });

    Distance.belongsTo(models.Place, {
      foreignKey: 'second_place_id',
      onDelete: 'CASCADE',
    });

  };

  return Distance;

};