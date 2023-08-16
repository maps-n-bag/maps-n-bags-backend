module.exports = (sequelize, DataTypes) => {

  const PlaceImage = sequelize.define('PlaceImage', {

    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true }
    }

  }, {
    underscored: true,
    tableName: 'place_image',
    timestamps: false
  });

  PlaceImage.associate = function (models) {
    PlaceImage.belongsTo(models.Place, { 
      foreignKey: 'place_id',
      onDelete: 'CASCADE',
    });
  };

  return PlaceImage;

};