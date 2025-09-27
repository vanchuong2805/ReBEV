const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('favorite_posts', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'favorite_posts',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__favorite__CA534F79ED3BB733",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "post_id" },
        ]
      },
    ]
  });
};
