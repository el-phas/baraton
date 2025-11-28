import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    // bcrypt hashes are always 60 chars, so use STRING(100)
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Useful for dashboards + security
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // For better auditing
    status: {
      type: DataTypes.ENUM("active", "disabled"),
      defaultValue: "active",
    },
    // role allows finer-grained permissions: 'admin' can edit, 'viewer' can only view
    role: {
      type: DataTypes.ENUM('admin', 'viewer'),
      defaultValue: 'admin',
    },
  },
  {
    timestamps: true,
    tableName: "users",

    // Extra protection
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

export default User;
