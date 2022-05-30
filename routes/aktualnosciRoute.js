const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// MIDDLEWARE
const encodeFile = require('../middleware/encodeFile');
const decodeFile = require('../middleware/decodeFile');

// MODEL
const UpdateModel = require('../models/UpdateModel');

// POST NEW UPDATE
router.post('/', encodeFile, async (req, res) => {

	const uploadedFile = req.fileData;

	try {
		// ADD NEW UPDATE TO DB
		const newUpdate = await new UpdateModel({
			title: req.body.title,
			message: req.body.message,
			file: uploadedFile,
			fileUrl: '',
		}).save();

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update added');

	} catch (error) {
		// RETURN ERROR
		console.log(error);
		return res.status(400).json('Cannot create a new update')
	}
})

// UPDATE EXISTING UPDATE
router.put('/:id', encodeFile, async (req, res) => {

	const uploadedFile = req.fileData;

	try {
		// UPDATE EXISITNG UPDATE IN THE DB
		const existingUpdate = await UpdateModel.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, message: req.body.message, file: uploadedFile, fileUrl: '' });

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update updated')
	} catch (error) {
		// RETURN ERROR
		return res.status(400).json('Cannot update existing update')
	}
})

// GET ALL UPDATES
router.get('/', decodeFile, (req, res) => {
	try {
		// DECODEFILE MIDDLEWARE TAKES CARE OF FETCHING ALL UPDATES
	} catch (error) {
		// IN CASE OF ERROR RETURN ERROR
		return res.json(400).json('Could not find updates in the database');
	}
})

// DELETE SPECIFIC UPDATE
router.delete('/:id', async (req, res) => {

	try {
		// DELETE THE UPDATE FROM THE DATABASE
		const deletedUpdate = await UpdateModel.findByIdAndDelete(req.params.id);

		// RESPOND TO CLIENT WITH CONFIRMATION
		return res.status(200).json('Update deleted');

	} catch (error) {
		// IN CASE OF ERROR RETURN ERROR
		return res.json(400).json('Could not delete update');
	}
})

module.exports = router;