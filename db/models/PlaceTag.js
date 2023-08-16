module.exports = (sequelize, DataTypes) => {

  const PlaceTag = sequelize.define('PlaceTag', {
    place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'place',
        key: 'id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tag',
        key: 'id'
      }
    }
  }, {
    underscored: true,
    tableName: 'place_tag',
    timestamps: false
  });

  PlaceTag.associate = function(models) {
    PlaceTag.belongsTo(models.Place, { foreignKey: 'place_id' });
    PlaceTag.belongsTo(models.Tag, { foreignKey: 'tag_id' });
  };

  return PlaceTag;

};
