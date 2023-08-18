module.exports = (sequelize, DataTypes) => {

  const NearbyRegion = sequelize.define('NearbyRegion', {

    first_region_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'region',
        key: 'id'
      },
      primaryKey: true,
    },
    second_region_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'region',
        key: 'id'
      },
      primaryKey: true,
    }

  }, {
    underscored: true,
    tableName: 'nearby_region',
    timestamps: false
  });

  NearbyRegion.associate = function (models) {

    NearbyRegion.belongsTo(models.Region, {
      foreignKey: 'first_region_id',
      onDelete: 'CASCADE',
    });

    NearbyRegion.belongsTo(models.Region, {
      foreignKey: 'second_region_id',
      onDelete: 'CASCADE',
    });

  };

  return NearbyRegion;

};