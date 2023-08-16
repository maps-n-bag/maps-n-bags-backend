module.exports = (sequelize, DataTypes) => {

  const Region = sequelize.define('Region', {

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }

  }, {
    underscored: true,
    tableName: 'region',
    timestamps: false
  });

  Region.associate = function (models) {
    Region.belongsTo(models.Place, {
      foreignKey: 'representative_place_id',
      onDelete: 'SET NULL',
    });
    Region.hasMany(models.Place, {
      foreignKey: 'region_id',
    });
  };

  return Region;

};
