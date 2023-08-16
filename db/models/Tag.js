module.exports = (sequelize, DataTypes) => {

  const Tag = sequelize.define('Tag', {

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    underscored: true,
    tableName: 'tag',
    timestamps: false
  });

  Tag.associate = function (models) {
    Tag.hasMany(models.PlaceActivity, {
      foreignKey: 'tag_id',
      onDelete: 'SET NULL',
    });
    Tag.belongsToMany(models.Place, {
      through: 'place_tag',
      foreignKey: 'tag_id',
      onDelete: 'SET NULL',
    });
  };

  return Tag;

};