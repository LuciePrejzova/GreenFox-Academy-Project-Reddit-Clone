"use strict";

export default function getSubscriptionModel(sequelize, { DataTypes, literal }) {
    const Subscription = sequelize.define(
        "subscription",
        {
            isActive: {
                type: DataTypes.INTEGER,
                field: "is_active",
                allowNull: false,
                defaultValue: 0
            }

        },
        {
            // timestamps: false,
            // createdAt: "created_at",
        }
    );

    Subscription.associate = (models) => {
        Subscription.belongsTo(models.User, { foreignKey: "user_id" });
        Subscription.belongsTo(models.Channel, { foreignKey: "channel_id" });
    };

    return Subscription;
}
