const router = require('express').Router();

// POST
router.post('/', (req, res) => {
	try {
		// GET THE DATA FROM THE FORM
		const { email, password } = req.body;

		// CHECK IF EMAIL AND PASSWORDS MATCH TO THE VARIABLES
		if (email === process.env.MASTER_EMAIL && password === process.env.MASTER_PASS) {
			return res.status(200).json({ email: email, userRole: 'admin' });
		} else {
			return res.status(401).json({ userRole: 'anonymous' });
		}

	} catch (error) {
		// RESPOND WITH ERROR
		res.status(400).json('An error occured');
	}
});

module.exports = router;