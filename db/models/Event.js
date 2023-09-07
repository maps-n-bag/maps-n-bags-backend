module.exports = (sequelize, DataTypes) => {

  const Event = sequelize.define('Event', {

    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    underscored: true,
    tableName: 'event',
    timestamps: false
  });

  Event.associate = function (models) {
    Event.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      onDelete: 'CASCADE',
    });
    Event.belongsTo(models.Place, {
      foreignKey: 'place_id',
    });
    Event.belongsTo(models.Activity, {
      foreignKey: 'activity_id',
    });
    Event.hasOne(models.EventDetail, { foreignKey: 'event_id' });
    Event.hasOne(models.EventImage, { foreignKey: 'event_id' });
  };

  return Event;
};