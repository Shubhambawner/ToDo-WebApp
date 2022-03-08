const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
	record: { type: String, required: true },
	date: {
		type: Number,
		default: Date.now
	},
	user_ID:{ type: Number, required: true }
})


const model = mongoose.model('TodoModel', TodoSchema)

module.exports = model
