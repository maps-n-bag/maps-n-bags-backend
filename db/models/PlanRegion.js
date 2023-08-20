module.exports = (sequelize, DataTypes) => {

  const PlanRegion = sequelize.define('PlanRegion', {
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plan',
        key: 'id'
      },
      primaryKey: true,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'region',
        key: 'id'
      },
      primaryKey: true,
    }

  }, {
    underscored: true,
    tableName: 'plan_region',
    timestamps: false
  });

  PlanRegion.associate = (models) => {
    PlanRegion.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      onDelete: 'CASCADE',
    });
    PlanRegion.belongsTo(models.Region, {
      foreignKey: 'region_id',
      onDelete: 'CASCADE',
    });
  };

  return PlanRegion;

};