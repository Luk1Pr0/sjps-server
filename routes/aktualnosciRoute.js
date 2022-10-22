const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// MIDDLEWARE
const uploadImageAndGetUrl = require('../middleware/uploadImage');

// MODEL
const PostModel = require('../models/PostModel');

// POST NEW UPDATE (DUPLICATE OF THE ABOVE TESTING WITHOUT THE ENCODEFILE MIDDLEWARE)
router.post('/', async (req, res) => {

	// FILE FROM THE REQUEST
	let uploadedFile;

	// CHECK IF THE FILE EXISTS OR NOT AND PROCEED ACCORDINGLY
	uploadedFile = req.files === null ? '' : req.files.file;

	try {
		// IMAGE DATA
		let imageData = {
			url: '',
			key: ''
		}

		// IF A FILE WAS UPLOADED PUSH IT TO S3
		if (uploadedFile !== '') {

			// UPLOAD THE IMAGE TO S3 AND GET THE IMAGE URL
			const returnedImage = await uploadImageAndGetUrl(uploadedFile);

			// ASSIGN THE VALUE TO THE OBJECT THAT WILL BE UPLOADED TO DB
			imageData.url = returnedImage.url;
			imageData.key = returnedImage.key;
		}

		// ADD NEW UPDATE TO DB
		const newUpdate = await new PostModel({
			title: req.body.title,
			message: req.body.message,
			fileUrl: imageData.url,
			fileKey: imageData.key,
		}).save();

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update added');
	} catch (error) {
		// RETURN ERROR
		console.log(error);
		return res.status(400).json(error);
	}
})

// UPDATE EXISTING UPDATE (DUPLICATE OF THE ABOVE TESTING WITHOUT THE ENCODEFILE MIDDLEWARE)
router.put('/:id', async (req, res) => {

	// FILE FROM THE REQUEST
	let uploadedFile;

	// CHECK IF THE FILE EXISTS OR NOT AND PROCEED ACCORDINGLY
	uploadedFile = req.files === null ? '' : req.files.file;

	try {
		// IMAGE DATA
		let imageData = {
			url: '',
			key: ''
		}

		// IF A NEW FILE WAS UPLOADED PUSH IT TO S3 AND GET URL
		if (uploadedFile !== '') {
			// UPLOAD THE IMAGE TO S3 AND GET THE IMAGE URL
			const returnedImage = await uploadImageAndGetUrl(uploadedFile);

			// ASSIGN THE VALUE TO THE OBJECT THAT WILL BE UPLOADED TO DB
			imageData.url = returnedImage.url;
			imageData.key = returnedImage.key;

			console.log('uploadedImage', uploadedFile);

		} else {
			// FIND THE UPDATE IN THE DATABASE
			const existingUpdate = await PostModel.findOne({ _id: req.params.id });

			// SET THE IMAGE URL TO THE ONE FROM DATABASE
			imageData.url = await existingUpdate.fileUrl;
			imageData.key = await existingUpdate.fileKey;
		}


		// UPDATE EXISTING UPDATE IN THE DB
		await PostModel.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, message: req.body.message, fileUrl: imageData.url, fileKey: imageData.key });

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
		const updatesFromDb = await PostModel.find();

		return res.status(200).json(updatesFromDb);
	} catch (error) {
		// IN CASE OF ERROR RETURN ERROR
		console.log(error);
		return res.json(400).json('Could not find updates in the database');
	}
})

// DELETE SPECIFIC UPDATE
router.delete('/:id', async (req, res) => {
	try {
		// RETRIEVE THE UPDATE TO DELETE
		const updateFromDb = await PostModel.findOne({ _id: req.params.id });

		// IF THE UPDATE HAS AN IMAGE URL THEN DELETE THE IMAGE IN S3
		if (updateFromDb.fileUrl.length > 1) {
			// DELETE THE IMAGE FROM THE S3 BUCKET
			await s3.deleteObject({
				Bucket: process.env.AWS_BUCKET_CUSTOM,
				Key: updateFromDb.fileKey,
			}, (err, data) => {
				if (err) console.log('error', err);
				console.log('Image deleted', data);
			});
		}

		// DELETE THE UPDATE FROM THE DATABASE
		const deletedUpdate = await PostModel.findByIdAndDelete(req.params.id);

		// RESPOND TO CLIENT WITH CONFIRMATION
		return res.status(200).json('Update deleted');

	} catch (error) {
		// IN CASE OF ERROR RETURN ERROR
		return res.json(400).json('Could not delete update');
	}
})

module.exports = router;