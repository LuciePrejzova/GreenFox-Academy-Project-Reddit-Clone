"use strict";

export default function getVoteModel(sequelize, { DataTypes, literal }) {
    const Vote = sequelize.define(
        "vote",
        {

            type: {
                type: DataTypes.STRING,
                /*allowNull: false,*/
                validate: {
                    notEmpty: true,
                    isIn: [["upvote", "downvote", "remove_vote"]]
                },
            },

            status: {
                type: DataTypes.INTEGER,
                field: "status",
                allowNull: false,
                defaultValue: 0
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

    Vote.associate = (models) => {
        Vote.belongsTo(models.User, { foreignKey: "user_id" });
        Vote.belongsTo(models.Post, { foreignKey: "post_id" });
    };
    return Vote;
}
