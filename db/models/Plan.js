module.exports = (sequelize, DataTypes) => {

  const Plan = sequelize.define('Plan', {

    title : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    start_date : {
      type : DataTypes.DATE,
      allowNull : false,
    },
    end_date : {
      type : DataTypes.DATE,
      allowNull : false,
    },
    description : {
      type : DataTypes.TEXT,
    }, 
    public : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
    },
    image : {
      type : DataTypes.STRING,
      validate : { isUrl : true },
      defaultValue : 'https://picsum.photos/200',
    }
  }, {
    underscored: true,
    tableName : 'plan',
    timestamps: false
  });

  Plan.associate = function(models) {
    Plan.belongsTo(models.User, {
      foreignKey : 'user_id',
      onDelete : 'CASCADE',
    });
  }

  return Plan;
};