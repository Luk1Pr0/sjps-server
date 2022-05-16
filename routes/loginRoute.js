const router = require('express').Router();

// POST
router.post('/', (req, res) => {
	try {
		// GET THE DATA FROM THE FORM
		const { email, password } = req.body;

		// CHECK IF EMAIL AND PASSWORDS MATCH TO THE VARIABLES
		if (email === 'lpytel16@gmail.com' && password === 'SjPs123') {
			return res.status(200).json({ accessDenied: false });
		} else {
			return res.status(401).json({ accessDenied: true });
		}

	} catch (error) {
		// RESPOND WITH ERROR
		res.status(400).json('An error occured');
	}
});

module.exports = router;