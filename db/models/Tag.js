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
    // Tag.belongsToMany(models.Place, {
    //   through: 'place_activity',
    //   foreignKey: 'tag_id',
    //   onDelete: 'CASCADE',
    // });
    // Tag.belongsToMany(models.Activity, {
    //   through: 'place_activity',
    //   foreignKey: 'tag_id',
    //   onDelete: 'CASCADE',
    // });
    Tag.belongsToMany(models.Place, {
      through: 'place_tag',
      foreignKey: 'tag_id',
      onDelete: 'CASCADE',
    });
  };

  return Tag;

};