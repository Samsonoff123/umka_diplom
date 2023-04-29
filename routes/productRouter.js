const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', ProductController.create)
router.post('/set-rating/:id', ProductController.setRating)
router.get('/', ProductController.getAll)
router.get('/:id', ProductController.getOne)
router.get('/getMostViews', ProductController.getMostViews)
router.delete('/:id', ProductController.remove)
router.post('/order', ProductController.createOrder)
router.get('/order', ProductController.getOrder)

module.exports = router