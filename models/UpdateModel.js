const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	message: {
		type: String,
	},
	file: {
		data: Buffer,
		type: String,
		default: '',
	},
	fileUrl: {
		type: String,
		default: ''
	},
	dateAdded: {
		type: Date,
		default: Date.now(),
	}
})

module.exports = mongoose.model('UpdateModel', updateSchema);