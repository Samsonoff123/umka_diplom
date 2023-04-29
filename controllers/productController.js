const uuid = require('uuid')
const path = require('path')
const {
    Product, Order, User
} = require('../models/models')
const ApiError = require('../error/ApiError')
const axios = require('axios')
const {
    parse
} = require('node-html-parser')
const {
    Op,
    Sequelize
} = require("sequelize");
const jwt = require('jsonwebtoken');

class ProductController {
    async create(req, res, next) {
        try {
            let {
                name,
                price,
                tag,
                img,
                description,
                shortDescription
            } = req.body
            const device = await Product.create({
                name,
                price,
                tag,
                img,
                description,
                shortDescription
            })

            return res.json(device)
        } catch (e) {
            console.log("error", e)
            next(ApiError.badRequest(e))
        }
    }

    async getAll(req, res) {
        let {
            limit,
            page
        } = req.query
        page = page || 1
        limit = limit || 100
        let offset = page * limit - limit

        let devices = await Product.findAndCountAll({
            limit,
            offset
        })

        return res.json(devices)
    }


    async getOne(req, res) {
        const {
            id
        } = req.params

        const device = await Product.findOne({
            where: {
                id
            },
        }, )

        await Product.update({
            views: device.views + 1
        }, {
            where: {
                id
            },
        }, )

        return res.json(device)
    }

    async getMostViews(req, res) {
        const devices = await Product.findAll()

        const mostViewedProduct = devices.reduce((prev, current) => {
            return (prev.views > current.views) ? prev : current;
          });

        return res.json(mostViewedProduct)
    }

    async setRating(req, res) {
        try {
            const {id} = req.params
            const {rating} = req.body
            const token = req.headers.authorization.split(' ')[1];
            const userId = token;

            if (!req.session.ratings) {
                req.session.ratings = {};
            }

            if (!req.session.ratings[id]) {
                req.session.ratings[id] = {
                  userId: userId,
                  rating: rating,
                };
                const device = await Product.findOne({
                    where: {
                        id
                    },
                }, )
    
                const num = (device.rating + rating) / 2
    
                await Product.update({
                    rating: num.toFixed(2)
                }, {
                    where: {
                        id
                    },
                }, )
    
                return res.json("Рейтинг успешно сохранен")
            }
            return res.json("Вы уже оценивали этот товар")

        } catch (error) {
            return res.json({
                error
            })
        }
    }

    async remove(req, res) {
        try {
            const postId = req.params.id

            await Product.destroy({
                where: {
                    id: postId
                },
            })

            const devices = await Product.findAll()

            return res.json(devices)

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Не удалось получить девайс'
            })
        }
    }

    async createOrder(req, res, next) {
        try {
            const {
                userId,
                productIds,
            } = req.body

            const prods = await Product.findAll()

            const products = []

            productIds.filter(async(id) => {
                prods.map(p => {
                    if (p.id === id) {
                        products.push(p)
                    }
                })
            })

            const user = await User.findOne({
                where: {
                    id: userId
                },
            })

            const order = await Order.create({
                user,
                products
            })


            return res.json(order)
        } catch (e) {
            console.log("error", e)
            next(ApiError.badRequest(e))
        }
    }

    async getOrder(req, res) {

        let products = await Order.findAll()

        return res.json(products)
    }
}

module.exports = new ProductController()