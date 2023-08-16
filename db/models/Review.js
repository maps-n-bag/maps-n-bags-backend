module.exports = (sequelize, DataTypes) => {

  const Review = sequelize.define('Review', {

    username: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    }

  }, {});

  Review.associate = (models) => {
    Review.belongsTo(models.Place, {
      foreignKey: 'place_id',
      onDelete: 'CASCADE',
    });
    Review.hasMany(models.ReviewImage, { foreignKey: 'review_id' });
  };

  return Review;

};
