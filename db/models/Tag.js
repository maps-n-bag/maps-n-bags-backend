module.exports = (sequelize, DataTypes) => {

  const Tag = sequelize.define('Tag', {

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {});

  Tag.associate = function (models) {
    Tag.belongsTo(models.PlaceActivity, {
      foreignKey: 'tag_id',
      onDelete: 'SET NULL',
    });
    Tag.belongsToMany(models.Place, {
      through: 'PlaceTag',
      foreignKey: 'tag_id',
      onDelete: 'SET NULL',
    });
  };

  return Tag;

};