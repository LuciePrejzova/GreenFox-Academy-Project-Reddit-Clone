"use strict";

export default function getChannelModel(sequelize, { DataTypes, literal }) {
  const Channel = sequelize.define(
    "channel",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      channelName: {
        type: DataTypes.STRING,
        field: "slug",
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isAlphanumeric: true,
        },
      },

      backgroundImage: {
        type: DataTypes.TEXT('long'),
        field: "background_image",
        validate: { notEmpty: true },
      },

      description: {
        type: DataTypes.TEXT,
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
      status: {
        type: DataTypes.BOOLEAN,
        field: "status",
        allowNull: false,
        defaultValue: true
      },
    },
    {
      timestamps: false,
      createdAt: "created_at",
    }
  );

  Channel.associate = (models) => {
    Channel.hasMany(models.Post, {
      onDelete: "SET NULL",
      foreignKey: "channel_id",
    });
    Channel.belongsTo(models.User, {
      onDelete: "SET NULL",
      foreignKey: "author_id",
    });
    Channel.hasOne(models.Subscription, {
      onDelete: "SET NULL",
      foreignKey: "channel_id",
    });
  };

  return Channel;
}
