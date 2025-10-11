const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "UQ__users__AB6E6164706BF3B6"
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "UQ__users__B43B145FBAFF32CD"
    },
    password: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    balance: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: false,
      defaultValue: 0
    },
    avatar: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'packages',
        key: 'id'
      }
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    package_start: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate')
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
    tableName: 'users',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__users__3213E83F674F4040",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__users__AB6E6164706BF3B6",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "UQ__users__B43B145FBAFF32CD",
        unique: true,
        fields: [
          { name: "phone" },
        ]
      },
    ]
  });
};
