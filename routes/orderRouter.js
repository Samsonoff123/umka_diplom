const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')

router.post('/', ProductController.createOrder)
router.get('/', ProductController.getOrder)
router.delete('/:orderId', ProductController.removeOrder)

module.exports = router