module.exports = (sequelize, DataTypes) => {

  const Place = sequelize.define('Place', {

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isAlphanumeric: true },
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('restaurant', 'residence', 'spot'),
      allowNull: false,
      defaultValue: 'restaurant'
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: -180, max: 180 }
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 0, max: 5 }
    },
    rating_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true }
    }

  }, {
    underscored: true,
    tableName: 'place',
    timestamps: false
  });

  Place.associate = function (models) {
    Place.hasMany(models.Event, { foreignKey: 'place_id' });
    Place.hasMany(models.Review, { foreignKey: 'place_id' });
    Place.hasOne(models.PlaceImage, { foreignKey: 'place_id' });
    Place.belongsTo(models.Region, { 
      foreignKey: 'region_id',
      onDelete: 'SET NULL',
    });
    Place.hasOne(models.Region, { foreignKey: 'representative_place_id' });
    Place.hasMany(models.Distance, { foreignKey: 'first_place_id' });
    Place.hasMany(models.Distance, { foreignKey: 'second_place_id' });
    Place.belongsToMany(models.Tag, { 
      through: 'place_tag',
      foreignKey: 'place_id',
      onDelete: 'CASCADE',
    });
    // Place.belongsToMany(models.Tag, {
    //   through: 'place_activity',
    //   foreignKey: 'place_id',
    //   onDelete: 'CASCADE',
    // });
    // Place.belongsToMany(models.Activity, { 
    //   through: 'place_activity',
    //   foreignKey: 'place_id',
    //   onDelete: 'CASCADE',
    // });
  };

  return Place;

};