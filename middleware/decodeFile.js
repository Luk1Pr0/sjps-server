const fs = require('fs');
const path = require('path');

const UpdateModel = require('../models/UpdateModel');

const decodeFile = async (req, res, next) => {

	// GET ALL UPDATES FROM DB
	const updatesFromDb = await UpdateModel.find();

	// ARRAY THAT WILL BE SENT AS A RESPONSE TO THE CLIENT
	const decodedUpdates = [];

	updatesFromDb.map(update => {

		if (update.file !== undefined || update.file !== '') {
			// CREATE A BUFFER FROM BASE64 FORMATTED IMG
			const buff = Buffer.from(update.file, 'base64');

			// CREATE A UNIQUE FILENAME BASED ON TITLE
			const uniqueFileName = update.title.toLowerCase().trim();

			// WRITE THE DECODED FILE To THE PUBLIC FOLDER
			fs.writeFileSync(path.join(__dirname, `../public/uploads/${uniqueFileName}.png`), buff);

			// CREATE A URL FOR THE FILE
			const fileUrl = `http://${req.headers.host}/${uniqueFileName}.png`;

			// SET THE FILE URL TO THE GENERATED URL
			update.fileUrl = fileUrl;
		}

		// PUSH THE UPDATE TO THE DECODED ARRAY WHICH WILL BE RETURNED TO THE CLIENT
		decodedUpdates.push(update);
	});

	res.status(200).json(decodedUpdates);

	return next();
}

module.exports = decodeFile; 