module.exports = (sequelize, DataTypes) => {

  const EventDetails = sequelize.define('EventDetails', {

    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    generated_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expenditure: {
      type: DataTypes.FLOAT,
      allowNull: true
    }

  }, {});

  EventDetails.associate = (models) => {

    EventDetails.belongsTo(models.Event, {
      foreignKey: 'event_id',
      onDelete: 'CASCADE'
    });

  };

  return EventDetails;

};