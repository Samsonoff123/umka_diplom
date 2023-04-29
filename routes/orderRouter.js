const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')

router.post('/', ProductController.createOrder)
router.get('/', ProductController.getOrder)

module.exports = router