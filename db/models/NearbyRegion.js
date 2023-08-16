module.exports = (sequelize, DataTypes) => {

  const NearbyRegion = sequelize.define('NearbyRegion', {

    first_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'region',
        key: 'id'
      }
    },
    second_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'region',
        key: 'id'
      }
    }

  }, {
    underscored: true,
    tableName: 'nearby_region',
    timestamps: false
  });

  NearbyRegion.associate = function (models) {

    NearbyRegion.belongsTo(models.Region, {
      foreignKey: 'first_region_id'
    });

    NearbyRegion.belongsTo(models.Region, {
      foreignKey: 'second_region_id'
    });

  };

  return NearbyRegion;

};