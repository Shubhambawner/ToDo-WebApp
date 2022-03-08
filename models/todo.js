const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
	record: { type: String, required: true },
	date: {
		type: Number,
		default: Date.now
	},
	user_ID:{ type: Number, required: true },
	complete:{type: Boolean, default: false},
	priority:{type:String, default: "Medium"}
})


const model = mongoose.model('TodoModel', TodoSchema)

module.exports = model
