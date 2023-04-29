const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', ProductController.create)
router.post('/order', ProductController.createOrder)
router.post('/set-rating/:id', ProductController.setRating)
router.get('/', ProductController.getAll)
router.get('/:id', ProductController.getOne)
router.get('/getMostViews', ProductController.getMostViews)
router.get('/order', ProductController.getOrder)
router.delete('/:id', ProductController.remove)

module.exports = router