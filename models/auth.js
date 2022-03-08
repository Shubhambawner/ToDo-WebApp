const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
	user_name: { type: String, required: true },
	user_password:{ type: String, required: true },
    user_ID:{type:Number, default:Date.now}
})

const authModel = mongoose.model('authModel', authSchema)

module.exports = authModel //what is difference in this syntax and export {authModel} this syntax
