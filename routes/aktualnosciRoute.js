const router = require('express').Router();

// MODEL
const UpdateModel = require('../models/UpdateModel');

// POST
router.post('/', async (req, res, next) => {
	const { title, message } = req.body;

	try {
		// ADD NEW UPDATE TO DB
		const newUpdate = await new UpdateModel({
			title: title,
			message: message
		}).save();

		// RETURN SUCCESSFULL RESPONSE
		return res.status(200).json('Update added')
	} catch (error) {
		// RETURN ERROR
		return res.status(400).json('Cannot connect to database')
	}
})

// GET
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

// DELETE POST
router.delete('/:id', async (req, res) => {

	try {
		// DELETE THE UPDATE FROM THE DATABASE
		const deletedUpdate = await UpdateModel.findByIdAndDelete(req.params.id);

		// RESPOND TO CLIENT WITH CONFIRMATION
		return res.status(200).json('Deleted');

	} catch (error) {
		// IN CASE OF ERROR RETURN ERROR
		return res.json(400).json('Could not delete update');
	}
})

module.exports = router;