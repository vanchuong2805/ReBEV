const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_media', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    is_thumbnail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'post_media',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__post_med__3213E83FC7C3F8BC",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
