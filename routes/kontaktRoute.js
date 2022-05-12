const router = require('express').Router();

// IMPORTS
const sendEmails = require('../sendEmail');

router.post('/', (req, res) => {
	try {
		const { fullName, email, message } = req.body;
		res.status(200).json('ok');
		sendEmails(fullName, email, message);
	} catch (error) {
		res.status(400).json('An error occured');
	}
});

module.exports = router;