const router = require('express').Router();

// IMPORTS
const sendEmails = require('../sendEmail');

// POST
router.post('/', (req, res) => {
	try {
		// GET THE DATA FROM THE FORM
		const { fullName, email, message } = req.body;

		// RESPOND TO USER THAT FORM HAS BEEN RECEIVED
		res.status(200).json('Form submitted');

		// SEND EMAIL TO THE USER AND ADMIN
		sendEmails(fullName, email, message);

	} catch (error) {
		// RESPOND WITH ERROR
		res.status(400).json('An error occured');
	}
});

module.exports = router;