const conn = require('../connect');
const { DataTypes } = require('sequelize');

const PackageModel = conn.define('package', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255)
    },
    bill_amount: {
        type: DataTypes.BIGINT
    },
    price: {
        type: DataTypes.BIGINT
    }
})

module.exports = PackageModel;