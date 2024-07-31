const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse,createTokenUser} = require('../utils')


const register = async(req,res)=>{
    const{email,name,password} = req.body
    const emailAlreadyExists = await User.findOne({email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Ya existe una cuenta con este email')
    }

    //first user is admin
    const isFirstAccount = (await User.countDocuments({}))===0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({name,email,password,role})
    const tokenUser = createTokenUser(user)
   
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

const login = async(req,res)=>{
    const {email,password} = req.body

    if (!email || !password){
        throw new CustomError.BadRequestError('Favor de ingresar email y contraseña')
    }

    const user = await User.findOne({email})
    
    if(!user){
        throw new CustomError.UnauthenticatedError('El usuario no existe')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Contraseña Incorrecta')
    }
    
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}
const logout = async(req,res)=>{
    res.cookie('token','logout',{
        httpOnly: true,
        expires: new Date(Date.now()),
    }
    )
    res.status(StatusCodes.OK).json({msg:'Se cerro la sesion'})
}

module.exports = {register,login,logout,};