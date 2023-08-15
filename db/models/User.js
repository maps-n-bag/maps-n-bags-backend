module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isAlphanumeric: true }
      },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isAlpha: true },
      defaultValue: 'John'
    },
    last_name: {
      type: DataTypes.STRING,
      validate: { isAlpha: true },
      defaultValue: 'Doe'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.STRING,
      validate: { isUrl: true },
      defaultValue: 'https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png'
    },
    cover_pic: {
      type: DataTypes.STRING,
      validate: { isUrl: true },
      defaultValue: 'https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png'
    }
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Plan , { foreignKey: 'user_id' });
  };

  return User;
};