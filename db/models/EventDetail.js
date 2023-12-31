module.exports = (sequelize, DataTypes) => {

  const EventDetail = sequelize.define('EventDetail', {

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'event',
        key: 'id'
      }
    },
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

  }, {
    underscored: true,
    tableName: 'event_detail',
    timestamps: false
  });

  EventDetail.associate = (models) => {

    EventDetail.belongsTo(models.Event, {
      foreignKey: 'event_id',
      onDelete: 'CASCADE'
    });

  };

  return EventDetail;

};