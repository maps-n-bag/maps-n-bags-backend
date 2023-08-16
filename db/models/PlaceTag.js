module.exports = (sequelize, DataTypes) => {

  const PlaceTag = sequelize.define('PlaceTag', {
    place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Places',
        key: 'id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tags',
        key: 'id'
      }
    }
  }, {});

  PlaceTag.associate = function(models) {
    PlaceTag.belongsTo(models.Place, { foreignKey: 'place_id' });
    PlaceTag.belongsTo(models.Tag, { foreignKey: 'tag_id' });
  };

  return PlaceTag;

};
