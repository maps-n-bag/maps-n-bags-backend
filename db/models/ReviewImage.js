module.exports = (sequelize, DataTypes) => {

  const ReviewImage = sequelize.define('ReviewImage', {

    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true }
    }

  }, {});

  ReviewImage.associate = function (models) {
    ReviewImage.belongsTo(models.Review, { 
      foreignKey: 'review_id',
      onDelete: 'CASCADE',
    });
  };

  return ReviewImage;

};