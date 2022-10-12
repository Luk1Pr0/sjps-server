const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// MIDDLEWARE


// MODEL
const UpdateModel = require('../models/UpdateModel');

// POST NEW UPDATE (DUPLICATE OF THE ABOVE TESTING WITHOUT THE ENCODEFILE MIDDLEWARE)
router.post('/', async (req, res) => {

	// FILE FROM THE REQUEST
	let uploadedFile;

	// CHECK IF THE FILE EXISTS OR NOT AND PROCEED ACCORDINGLY
	req.files === null ? uploadedFile = '' : uploadedFile = req.files.file;

	try {

		// IMAGE URL VARIABLE
		let imageUrl = '';

		// IF A FILE WAS UPLOADED PUSH IT TO S3
		if (uploadedFile !== '') {
			// UPLOAD THE FILE TO S3
			const image = await s3.putObject({
				Body: Buffer.from(uploadedFile.data),
				Bucket: "cyclic-stormy-cyan-neckerchief-eu-west-1",
				Key: uploadedFile.name,
			}).promise();

			// GET THE URL OF THE UPLOADED IMAGE
			const uploadedImageUrl = s3.getSignedUrl('getObject', {
				Bucket: "cyclic-stormy-cyan-neckerchief-eu-west-1",
				Key: uploadedFile.name,
			});

			// ASSIGN THE IMAGE TO THE VARIABLE CREATED ABOVE
			imageUrl = uploadedImageUrl;
		}

		// ADD NEW UPDATE TO DB
		const newUpdate = await new UpdateModel({
			title: req.body.title,
			message: req.body.message,
			fileUrl: imageUrl,
		}).save();

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update added');
	} catch (error) {
		// RETURN ERROR
		return res.status(400).json(error);
	}
})

// UPDATE EXISTING UPDATE (DUPLICATE OF THE ABOVE TESTING WITHOUT THE ENCODEFILE MIDDLEWARE)
router.put('/:id', async (req, res) => {

	// FILE FROM THE REQUEST
	let uploadedFile;

	// CHECK IF THE FILE EXISTS OR NOT AND PROCEED ACCORDINGLY
	req.files === null ? uploadedFile = '' : uploadedFile = req.files.fileUrl;

	try {
		// UPDATE EXISITNG UPDATE IN THE DB
		const existingUpdate = await UpdateModel.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, message: req.body.message, fileUrl: uploadedFile });

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update updated')
	} catch (error) {
		// RETURN ERROR
		return res.status(400).json('Cannot update existing update')
	}
})

// GET ALL UPDATES
router.get('/', async (req, res, next) => {
	try {
		// GET ALL UPDATES FROM DB
		const updatesFromDb = await UpdateModel.find();

		return res.status(200).json(updatesFromDb);
	} catch (error) {
		// IN CASE OF ERROR RETURN ERROR
		console.log(error);
		// return res.json(400).json('Could not find updates in the database');
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