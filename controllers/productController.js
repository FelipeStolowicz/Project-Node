const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require ('../errors')
const path = require ('path')


const createProduct = async (req,res)=>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async (req,res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length})
}

const getSingleProduct = async (req,res)=>{
    const {id:productId} = req.params
    const products = await Product.findOne({_id:productId}).populate('reviews')
    
    if(!products){
        throw new CustomError.NotFoundError('No existe un producto con ese codigo')
    }
    res.status(StatusCodes.OK).json({products})
}

const updateProduct = async (req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{new:true, runValidators:true})
    if(!product){
        throw new CustomError.NotFoundError('No existe un producto con ese codigo')
    }
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async (req,res)=>{
    const {id:productId} = req.params
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError('No existe un producto con ese codigo')
    }
    await product.remove()
    res.status(StatusCodes.OK).json('Elimando exitosamente')
}

const uploadImage = async (req,res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('No se subio ninguna imagen')
    }
    const productImage = req.files.image

    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Suba una Imagen')
    }
    
    const maxSize = 1024 * 1024

    if(productImage.size>maxSize){
        throw new CustomError.BadRequestError('La imagen es muy grande, suba una mas chica')
    }

    const imagePath = path.join(__dirname,'../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`})
}

module.exports = {createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,uploadImage}