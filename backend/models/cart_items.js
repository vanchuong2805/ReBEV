const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart_items', {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'cart_items',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__cart_ite__D54C64166D9C64B6",
        unique: true,
        fields: [
          { name: "post_id" },
          { name: "user_id" },
        ]
      },
    ]
  });
};
