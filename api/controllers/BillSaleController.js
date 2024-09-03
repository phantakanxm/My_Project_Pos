const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("./Service");

const BillSaleModel = require("../models/BillSaleModel");
const BillSaleDetailModel = require("../models/BillSaleDetailModel");

app.get('/billSale/openBill', service.isLogin, async (req, res) => {
    try {
        const payload = {
            userId: service.getMemberId(req),
            status: 'open'
        };

        let result = await BillSaleModel.findOne({
            where: payload
        });

        if (result == null) {
            result = await BillSaleModel.create(payload);
        }

        res.send({ message: 'success', result: result });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.message });
    }
})

app.post('/billSale/sale', service.isLogin, async (req, res) => {
    try {
        const payload = {
            userId: service.getMemberId(req),
            status: 'open'
        };
        const currentBill = await BillSaleModel.findOne({
            where: payload
        });
        const item = {
            price: req.body.price,
            productId: req.body.id,
            billSaleId: currentBill.id,
            userId: payload.userId
        }
        const billSaleDetail = await BillSaleDetailModel.findOne({
            where: item
        });

        if (billSaleDetail == null) {
            item.qty = 1;
            await BillSaleDetailModel.create(item);
        } else {
            item.qty = parseInt(billSaleDetail.qty) + 1;
            await BillSaleDetailModel.update(item, {
                where: {
                    id: billSaleDetail.id
                }
            })
        }

        res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        res.send({ messag: e.message });
    }
})

app.get('/billSale/currentBillInfo', service.isLogin, async (req, res) => {
    try {
        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        const results = await BillSaleModel.findOne({
            where: {
                status: 'open',
                userId: service.getMemberId(req)
            },
            include: {
                model: BillSaleDetailModel,
                order: [['id', 'DESC']],
                include: {
                    model: ProductModel,
                    attributes: ['name']
                }
            }
        })

        res.send({ results: results });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.messag });
    }
})

app.delete('/billSale/deleteItem/:id', service.isLogin, async (req, res) => {
    try {
        await BillSaleDetailModel.destroy({
            where: {
                id: req.params.id
            }
        });
        res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: 'success' });
    }
})

app.post('/billSale/updateQty', service.isLogin, async (req, res) => {
    try {
        await BillSaleDetailModel.update({
            qty: req.body.qty
        }, {
            where: {
                id: req.body.id
            }
        })

        res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        res.send({ mesage: e.mesage });
    }
})

app.get('/billSale/endSale', service.isLogin, async (req, res) => {
    try {
        await BillSaleModel.update({
            status: 'pay'
        }, {
            where: {
                status: 'open',
                userId: service.getMemberId(req)
            }
        })

        res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: 'success' });
    }
})

app.get('/billSale/lastBill', service.isLogin, async (req, res) => {
    try {
        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        const result = await BillSaleModel.findAll({
            where: {
                status: 'pay',
                userId: service.getMemberId(req)
            },
            order: [['id', 'DESC']],
            limit: 1,
            include: {
                model: BillSaleDetailModel,
                attributes: ['qty', 'price'],
                include: {
                    model: ProductModel,
                    attributes: ['barcode', 'name']
                }
            }
        })

        res.send({ message: 'success', result: result });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.message });
    }
})

app.get('/billSale/billToday', service.isLogin, async (req, res) => {
    try {
        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        const now = new Date();
        now.setHours(23, 59, 59, 59);

        const { Sequelize } = require('sequelize');
        const Op = Sequelize.Op;

        const results = await BillSaleModel.findAll({
            where: {
                status: 'pay',
                userId: service.getMemberId(req),
                createdAt: {
                    [Op.between]: [
                        startDate.toISOString(),
                        now.toISOString()
                    ]
                }
            },
            order: [['id', 'DESC']],
            include: {
                model: BillSaleDetailModel,
                attributes: ['qty', 'price'],
                include: {
                    model: ProductModel,
                    attributes: ['barcode', 'name']
                }
            }
        })

        res.send({ message: 'success', results: results });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.message });
    }
})

// day 17
app.get('/billSale/list', service.isLogin, async (req, res) => {
    const BillSaleDetailModel = require('../models/BillSaleDetailModel');
    const ProductModel = require('../models/ProductModel');

    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    try {
        const results = await BillSaleModel.findAll({
            order: [['id', 'DESC']],
            where: {
                status: 'pay',
                userId: service.getMemberId(req)
            },
            include: {
                model: BillSaleDetailModel,
                include: {
                    model: ProductModel
                }
            }
        });
        res.send({ message: 'success', results: results });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.mesage });
    }
});
app.get('/billSale/listByYearAndMonth/:year/:month', service.isLogin, async (req, res) => {
    try {
        let arr = [];
        let y = req.params.year;
        let m = req.params.month;
        let daysInMonth = new Date(y, m, 0).getDate();

        const { Sequelize } = require('sequelize');
        const Op = Sequelize.Op;
        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        for (let i = 1; i <= daysInMonth; i++) {
            const results = await BillSaleModel.findAll({
                where: {
                    [Op.and]: [
                        Sequelize.fn('EXTRACT(YEAR from "billSaleDetails"."createdAt") = ', y),
                        Sequelize.fn('EXTRACT(MONTH from "billSaleDetails"."createdAt") = ', m),
                        Sequelize.fn('EXTRACT(DAY from "billSaleDetails"."createdAt") = ', i),
                    ],
                    userId: service.getMemberId(req)
                },
                include: {
                    model: BillSaleDetailModel,
                    include: {
                        model: ProductModel
                    }
                }
            });

            let sum = 0;

            for (let j = 0; j < results.length; j++) {
                const result = results[j];

                for (let k = 0; k < result.billSaleDetails.length; k++) {
                    const item = result.billSaleDetails[k];

                    sum += parseInt(item.qty) * parseInt(item.price);
                }
            }

            arr.push({
                day: i,
                results: results,
                sum: sum
            });
        }

        res.send({ message: 'success', results: arr });
    } catch (e) {
        res.statusCode = 500;
        res.send({ message: e.message });
    }
})

module.exports = app;
