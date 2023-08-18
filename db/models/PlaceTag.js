module.exports = (sequelize, DataTypes) => {

  const PlaceTag = sequelize.define('PlaceTag', {
    place_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'place',
        key: 'id'
      },
      primaryKey: true,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id'
      },
      primaryKey: true,
    }
  }, {
    underscored: true,
    tableName: 'place_tag',
    timestamps: false
  });

  PlaceTag.associate = function(models) {

  };

  return PlaceTag;

};
