const Auth = require('../models/auth')

let authMiddleware = {}
module.exports = authMiddleware

authMiddleware.check = async (req, res,next)=>{
    console.log('auth middleware hit', req.query.user_ID);next()
    // isAuth = await Auth.findOne(req.body.user_ID)
    // if(isAuth) next()
    // else res.send('<h1> User not authorised </h1>');
}