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
      unique: "UQ__users__AB6E6164188A65D9"
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "UQ__users__B43B145F8D2B46B7"
    },
    password: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'roles',
        key: 'id'
      }
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
    is_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    create_at: {
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
        name: "PK__users__3213E83F7F583F5F",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "UQ__users__AB6E6164188A65D9",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "UQ__users__B43B145F8D2B46B7",
        unique: true,
        fields: [
          { name: "phone" },
        ]
      },
    ]
  });
};
