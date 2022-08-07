const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
});

const Event = sequelize.define("event", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    date: {type: DataTypes.DATEONLY, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
});

const Invitation = sequelize.define("invitation", {
    isAccepted: DataTypes.BOOLEAN,
});

User.hasMany(Invitation);
Invitation.belongsTo(User);

Event.hasMany(Invitation);
Invitation.belongsTo(Event);

module.exports = {
    User,
    Event,
    Invitation,
};