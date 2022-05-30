const fs = require('fs');
const path = require('path');

const UpdateModel = require('../models/UpdateModel');

const decodeFile = async (req, res, next) => {

	// GET ALL UPDATES FROM DB
	const updatesFromDb = await UpdateModel.find();

	// ARRAY THAT WILL BE SENT AS A RESPONSE TO THE CLIENT
	const decodedUpdates = [];

	updatesFromDb.map(update => {

		// IF FILE EXISTS
		if (update.file !== '' || update.fileName !== '') {

			// CREATE A BUFFER FROM BASE64 FORMATTED IMG
			const buff = Buffer.from(update.fileData, 'base64');

			// WRITE THE DECODED FILE To THE PUBLIC FOLDER
			fs.writeFileSync(path.join(__dirname, `../public/uploads/${update.fileName}`), buff);

			// CREATE A URL FOR THE FILE
			const fileUrl = `https://${req.headers.host}/${update.fileName}`;

			// SET THE FILE URL TO THE GENERATED URL
			update.fileUrl = fileUrl;

			// PUSH THE UPDATE TO THE DECODED ARRAY WHICH WILL BE RETURNED TO THE CLIENT
			decodedUpdates.push(update);
		}
		// IF FILE IS EMPTY
		if (update.file === '') {
			update.fileUrl = '';
			update.fileName = '';

			// PUSH THE UPDATE TO THE DECODED ARRAY WHICH WILL BE RETURNED TO THE CLIENT
			decodedUpdates.push(update);
		}
	});

	res.status(200).json(decodedUpdates);

	return next();
}

module.exports = decodeFile; 