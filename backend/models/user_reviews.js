const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_reviews', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_detail',
        key: 'id'
      }
    },
    rating_value: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
    }
  }, {
    sequelize,
    tableName: 'user_reviews',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__user_rev__3213E83FF97DADC8",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
