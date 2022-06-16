"use strict";

import bcrypt from "bcrypt";

export default function getUserModel(sequelize, { DataTypes, literal }) {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 8,
        },
        set(value) {
          const salt = bcrypt.genSaltSync(12);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue("password", hash);
        },
      },

      activationToken: {
        type: DataTypes.STRING(24),
        field: "activation_token",
        allowNull: false,
        unique: true,
        validate: {
          is: /^[a-zA-Z0-9]{24}$/,
        },
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
        allowNull: false,
        defaultValue: false,
      },

      // 0 -> soft deleted, 1 -> "active"
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },

      isAdmin: {
        type: DataTypes.BOOLEAN,
        field: "is_admin",
        allowNull: false,
        defaultValue: false,
      },

      googleID: {
        type: DataTypes.INTEGER,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },

      // TODO -> base64 conversion + type: TEXT ?
      profilePicture: {
        type: DataTypes.TEXT('long'),
        field: "profile_picture",
        validate: {
          notEmpty: true,
        },
      },

      createdAt: {
        type: "TIMESTAMP",
        field: "created_at",
        defaultValue: literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },

      updatedAt: {
        type: "TIMESTAMP",
        field: "updated_at",
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },

    {
      timestamps: false,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // AFTER THE USER IS DELETED, ITS CHANNELS WILL REMAIN
  User.associate = (models) => {
    User.hasMany(models.Channel, {
      onDelete: "NO ACTION",
      foreignKey: "author_id",
    });
    User.hasMany(models.Post, {
      onDelete: "NO ACTION",
      foreignKey: "author_id",
    });
    User.hasMany(models.Message, {
      foreignKey: {
        name: "sender_id",
        allowNull: false,
      },
      onDelete: "NO ACTION",
    });
    User.hasMany(models.Message, {
      foreignKey: {
        name: "recipient_id",
        allowNull: false,
      },
      onDelete: "NO ACTION",
    });
    User.hasMany(models.Subscription, {
      onDelete: "NO ACTION",
      foreignKey: "user_id",
    });
    User.hasMany(models.Vote, {
      onDelete: "NO ACTION",
      foreignKey: "user_id",
    });
    User.hasMany(models.Comment, {
      onDelete: "NO ACTION",
      foreignKey: "author_id",
    });
  };

  return User;
}
