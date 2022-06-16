"use strict";

export default function getCommentModel(sequelize, { DataTypes, literal }) {
  const Comment = sequelize.define(
    "comment",
    {
      content: {
        type: DataTypes.TEXT,
        unique: false,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        field: "status",
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
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, {
      onDelete: "SET NULL",
      foreignKey: "post_id",
    });
    Comment.belongsTo(models.User, {
      onDelete: "SET NULL",
      foreignKey: "author_id",
    });
  };

  return Comment;
}
