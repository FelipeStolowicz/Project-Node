const Order = require('../models/Order')
const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({amount,currency}) =>{
    const client_secret = 'someRandomValue'
    return {client_secret,amount}
}


const createOrder = async(req,res)=>{
    const {items:cartItems,tax,shippingFee} = req.body

    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError('No hay productos en el carrito')
    }

    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError('Favor de proveer impuesto y costo de envio')
    }
    let orderItems = []
    let subtotal = 0
    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product})
    if(!dbProduct){
        throw new CustomError.NotFoundError(`No hay producto con el ID: ${item.product}`)
    }
    const {name,price,image,_id} = dbProduct
    const singleOrderItem = {
        amount: item.amount,
        name,price,image,product:_id
    }
    //add item to order
    orderItems = [...orderItems,singleOrderItem]
    //subtotal
    subtotal += item.amount * price
    }
    const total = tax + shippingFee + subtotal
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    })

    const order = await Order.create({
        orderItems,total,subtotal,tax,shippingFee,clientSecret:paymentIntent.client_secret,user:req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret})
}

const getAllOrders = async(req,res)=>{
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}

const getSingleOrder = async(req,res)=>{
    const {id:orderId} = req.params
    const order = await Order.findOne({_id:orderId})
    if (!order){
        throw new CustomError.NotFoundError(`No hay orden con el ID: ${orderId}`)
    }
    checkPermissions(req.user,order.user)
    res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrder = async(req,res)=>{
    const orders = await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({orders})
}

const updateOrder = async(req,res)=>{
    const {id: orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError('No se encontraron ordenes para el usuario')
    }
    checkPermissions(req.user,order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})

}


module.exports = {createOrder,getAllOrders,getSingleOrder,getCurrentUserOrder,updateOrder}