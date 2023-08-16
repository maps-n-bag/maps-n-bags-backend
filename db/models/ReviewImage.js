module.exports = (sequelize, DataTypes) => {

  const ReviewImage = sequelize.define('ReviewImage', {

    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true }
    }

  }, {
    underscored: true,
    tableName: 'review_image',
    timestamps: false
  });

  ReviewImage.associate = function (models) {
    ReviewImage.belongsTo(models.Review, { 
      foreignKey: 'review_id',
      onDelete: 'CASCADE',
    });
  };

  return ReviewImage;

};