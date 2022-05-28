const router = require('express').Router();
const path = require('path');
const url = require('url');

// MODEL
const UpdateModel = require('../models/UpdateModel');

// POST NEW UPDATE
router.post('/', async (req, res, next) => {

	console.log(req.headers.host);

	console.log(url.parse(req.headers.host), true);

	const uploadedFile = req.files.file;

	// IF NO FILE ADDED THEN RETURN ELSE, PROCESS THE FILE
	if (!uploadedFile || uploadedFile === null || uploadedFile === undefined) {
		return res.status(200).json('No file uploaded');
	} else {

		// GENERATE CURRENT DATE TO USE IT IN THE FILE NAME
		const newDate = Date.parse(new Date()).toString();

		// GENERATE UNIQUE FULL NAME
		const uniqueFileName = `${newDate}${uploadedFile.name.toLowerCase()}`;

		// SET THE TARGET PATH FOR THE FILE TO BE STORED IN
		const targetPath = path.join(__dirname, '../public/uploads/', uniqueFileName);

		// MOVE FILE TO THE CORRECT DIR
		const movedFile = uploadedFile.mv(targetPath)

		// GET URL FOR THE FILE
		const fileUrl = url.pathToFileURL(targetPath).href;

		console.log(fileUrl);

		try {
			// ADD NEW UPDATE TO DB
			const newUpdate = await new UpdateModel({
				title: req.body.title,
				message: req.body.message,
				filePath: fileUrl,
			}).save();

			// console.log(await UpdateModel.findOne({ filePath: uploadedFile.path }));

			// RETURN SUCCESSFULL RESPONSE
			return res.status(200).json('Update added')
		} catch (error) {
			// RETURN ERROR
			console.log(error);
			return res.status(400).json('Cannot create a new update')
		}
	}
})

// UPDATE EXISTING UPDATE
router.put('/:id', async (req, res, next) => {

	// DATA THAT NEEDS TO BE UPDATED
	const { title, message } = req.body;

	// ID OF UPDATE THAT NEEDS TO BE UPDATED
	const { id } = req.params;

	try {
		// UPDATE EXISITNG UPDATE IN THE DB
		const existingUpdate = await UpdateModel.findOneAndUpdate({ _id: id }, { title: title, message: message });

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update updated')
	} catch (error) {
		// RETURN ERROR
		return res.status(400).json('Cannot update existing update')
	}
})

// GET ALL UPDATES
router.get('/', async (req, res) => {
	try {
		// GET UPDATES FROM
		const updatesFromDb = await UpdateModel.find();

		// RESPOND TO CLIENT WITH ALL UPDATES
		return res.status(200).json(updatesFromDb);

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