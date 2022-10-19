const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	message: {
		type: String,
	},
	fileUrl: {
		type: String,
		default: '',
	},
	fileKey: {
		type: String,
		default: '',
	},
	dateAdded: {
		type: Date,
		default: Date.now(),
	}
})

module.exports = mongoose.model('PostModel', postSchema);