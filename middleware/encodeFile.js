const path = require('path');
const fs = require('fs');

const encodeFile = async (req, res, next) => {

	// IF NO FILE UPLOADED CONTINUE
	if (req.files === null) {
		return next();
	} else {

		try {
			const uploadedFile = req.files.file;
			const uploadedFileName = uploadedFile.name.toLowerCase().trim();

			// CREATE A FILEPATH TO SAVE THE FILE IN
			const filePath = path.join(__dirname, '../public/uploads/', uploadedFileName);

			// MOVE FILE TO THE CORRECT LOCATION
			uploadedFile.mv(filePath);

			// ENCODE THE IMAGE BUFFER INTO A STRING BASE64
			const base64Img = Buffer.from(uploadedFile.data, 'base64').toString('base64');

			// SET FILE AS A REQUEST VARIABLE
			req.fileData = base64Img;
			req.fileName = uploadedFile.name;

			return next();
		}
		catch (err) {
			return res.json({ status: 400, msg: err })
		}

	}
}

module.exports = encodeFile;