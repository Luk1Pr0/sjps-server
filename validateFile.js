const path = require('path');

const validateFile = (req, res, next) => {

	// IF NO FILE UPLOADED CONTINUE
	if (req.files === null) {
		return next();
	} else {
		// GET APP BASE URL
		const baseUrl = req.headers.host;

		const uploadedFile = req.files.file;

		// GENERATE CURRENT DATE TO USE IT IN THE FILE NAME
		const newDate = Date.parse(new Date()).toString();

		// GENERATE UNIQUE FULL NAME
		const uniqueFileName = `${newDate}${uploadedFile.name.toLowerCase()}`;

		// SET THE TARGET PATH FOR THE FILE TO BE STORED IN
		const targetPath = path.join(__dirname, './public/uploads', uniqueFileName);

		// CREATE FILE URL WITH THE BASE LINK OF WEBSITE
		const fileUrl = `${req.protocol}://${baseUrl}/${uniqueFileName}`

		// MOVE FILE TO THE CORRECT DIR
		uploadedFile.mv(targetPath, err => {
			// IF THERE IS AN ERROR WHEN MOVING FILE, LOG IT
			if (err) {
				console.log('ERROR', err);
			}
		});

		// SET FILE AS A REQUEST VARIABLE
		req.fileUrl = fileUrl;
		return next();
	}
}

module.exports = validateFile;