"use strict";

export default function getPostModel(sequelize, { DataTypes, literal }) {
  const Post = sequelize.define(
    "post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["link", "image", "text"]],
        },
      },

      // if type === "image", it should be convereted to text with base64 encoding
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },


      isActive: {
        type: DataTypes.INTEGER,
        field: "is_active",
        allowNull: false,
        defaultValue: 1,
      },

      createdAt: {
        type: "TIMESTAMP",
        field: "created_at",
        defaultValue: literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      }
    },
    {
      timestamps: false,
      createdAt: "created_at",
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: "author_id" });
    Post.belongsTo(models.Channel, { foreignKey: "channel_id" });
    Post.hasMany(models.Vote, {
      onDelete: "NO ACTION",
      foreignKey: "post_id",
    });
    Post.hasMany(models.Comment, {
      onDelete: "NO ACTION",
      foreignKey: "post_id",
    });
  };

  return Post;
}
