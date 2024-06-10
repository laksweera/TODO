import sequelize from "../config/db.connection.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING,
        },
        otpExpiryTime: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "Users",
    }
);

export const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(2500),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("inprogress", "completed"),
            defaultValue: "inprogress",
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        tableName: "Tasks",
    }
);

// Define the association
User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks'
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});
