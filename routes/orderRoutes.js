const {createOrder,getAllOrders,getSingleOrder,getCurrentUserOrder,updateOrder} = require ('../controllers/orderController')
const express = require('express')
const router = express.Router()
const {authenticateUser,authorizePermissions} = require('../middleware/authentication')

router.route('/').post(authenticateUser,createOrder).get(authenticateUser,authorizePermissions('admin'),getAllOrders)

router.route('/showAllMyOrders').get(authenticateUser,getCurrentUserOrder)

router.route('/:id').get(authenticateUser,getSingleOrder).patch(authenticateUser,updateOrder)


module.exports = router