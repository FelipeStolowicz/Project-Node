const CustomError = require('../errors')
const {isTokenValid} = require('../utils')

/*
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
      throw new CustomError.UnauthenticatedError('No se pudo Autentificar');
    }
  
    try {
      const { name, userId, role } = isTokenValid({ token });
      req.user = { name, userId, role };
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError('No se pudo autentificar');
    }
  };
  */
  const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
  
    if (!token) {
      throw new CustomError.UnauthenticatedError('No se pudo autentificar');
    }
  
    try {
      const { name, userId, role } = isTokenValid({ token });
      req.user = { name, userId, role };
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError('No se pudo autentificar');
    }
  };
  const authorizePermissions = (...roles) => {
        return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('No tiene autorizacion para acceder')
        }    
      next();
    };
}

module.exports = {authenticateUser,authorizePermissions,}