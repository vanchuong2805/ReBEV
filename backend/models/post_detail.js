const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_detail', {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    variation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'variations',
        key: 'id'
      }
    },
    variation_value_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'variation_values',
        key: 'id'
      }
    },
    custom_value: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'post_detail',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__post_det__85D448B6770414F5",
        unique: true,
        fields: [
          { name: "post_id" },
          { name: "variation_id" },
        ]
      },
    ]
  });
};
