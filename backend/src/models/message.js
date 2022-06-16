"use strict";

export default function getMessageModel(sequelize, { DataTypes, literal }) {
  const Message = sequelize.define(
    "message",
    {

      subject: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      // recipientId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },

      isActive: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
        allowNull: false,
        defaultValue: true
      },

      createdAt: {
        type: "TIMESTAMP",
        field: "created_at",
        defaultValue: literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      createdAt: "created_at",
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'sender_id',
        allowNull: false
      }
    });
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'recipient_id',
        allowNull: false
      }
    });
  }

  return Message;
}
