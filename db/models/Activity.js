module.exports = (sequelize, DataTypes) => {

  const Activity = sequelize.define('Activity', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min_time: {
      // in hours
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_time: {
      // in hours
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {
    underscored: true,
    tableName: 'activity',
    timestamps: false
  });

  Activity.associate = (models) => {
    Activity.belongsToMany(models.Place, {
      through: 'place_activity',
      foreignKey: 'activity_id',
      onDelete: 'CASCADE',
    });
    Activity.belongsToMany(models.Tag, {
      through: 'place_activity',
      foreignKey: 'activity_id',
      onDelete: 'CASCADE',
    });
  };

  return Activity;

};