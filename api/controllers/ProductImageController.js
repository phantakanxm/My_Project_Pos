const express = require('express')
const Service = require('./Service')
const app = express()
const ProductImageModel = require('../models/ProductImageModel');
const fileUpload = require('express-fileupload');
const fs = require('fs');

app.use(fileUpload());

app.post('/productImage/insert', Service.isLogin, async (req, res) => {
    try {        
        const myDate = new Date();
        const y = myDate.getFullYear();
        const m = myDate.getMonth() + 1;
        const d = myDate.getDate();
        const h = myDate.getHours();
        const mm = myDate.getMinutes();
        const s = myDate.getSeconds();
        const ms = myDate.getMilliseconds();
        const productImage = req.files.productImage;
        const random = Math.random() * 1000;
        const newName =  y + '-' + m + '-' + d + '-' + h + '-' + mm + '-' + s + '-' + ms + '-' + random;
        const arr = productImage.name.split('.');
        const ext = arr[arr.length - 1];
        const fullNewName = newName + '.' + ext;
        const uploadPath = __dirname + '/../uploads/' + fullNewName;

        await productImage.mv(uploadPath, async err => {
            if (err) throw new Error(err);

            await ProductImageModel.create({
                isMain: false,
                imageName: fullNewName,
                productId: req.body.productId
            });

            res.send({message: 'success'});
        })
    } catch (e) {
        res.statusCode = 500;
        res.send({message: e.message});
    }
})
app.get('/productImage/list/:productId', Service.isLogin, async (req, res) => {
    try {
        const results = await ProductImageModel.findAll({
            where: {
                productId: req.params.productId
            },
            order: [['id', 'DESC']]
        })
        res.send({message: 'success', results: results});
    } catch (e) {
        res.statusCode = 500;
        res.send({message: e.message});
    }
})
app.delete('/productImage/delete/:id', Service.isLogin, async (req, res) => {
    try {
        const row = await ProductImageModel.findByPk(req.params.id);
        const imageName = row.imageName;

        await ProductImageModel.destroy({
            where: {
                id: req.params.id
            }
        })

        fs.unlinkSync('uploads/' + imageName);

        res.send({message: 'success'});
    } catch (e) {
        res.statusCode = 500;
        res.send({message: e.message});
    }
})
app.get('/productImage/chooseMainImage/:id/:productId', Service.isLogin, async (req, res) => {
    try {
        await ProductImageModel.update({
            isMain: false
        }, {
            where: {
                productId: req.params.productId
            }
        })

        await ProductImageModel.update({
            isMain: true
        }, {
            where: {
                id: req.params.id
            }
        })

        res.send({message: 'success'});
    } catch (e) {
        res.statusCode = 500;
        res.send({message: e.message});
    }
})

module.exports = app;