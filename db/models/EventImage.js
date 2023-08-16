module.exports = (sequelize, DataTypes) => {

  const EventImage = sequelize.define('EventImage', {

    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isUrl: true },
      defaultValue: 'https://placehold.co/600x400'
    },

  }, {
    underscored: true,
    tableName: 'event_image',
    timestamps: false
  });

  EventImage.associate = (models) => {

    EventImage.belongsTo(models.Event, {
      foreignKey: 'event_id',
      onDelete: 'CASCADE'
    });

  };

  return EventImage;

};