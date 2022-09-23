const fs = require('fs');
const path = require('path');

const decodeFile = (updatesArr, req) => {

	// ARRAY THAT WILL BE SENT AS A RESPONSE TO THE CLIENT
	const decodedUpdates = [];

	console.log(req.protocol);

	updatesArr.map(update => {

		if (update.fileName !== '') {
			try {
				// CREATE AN IMG BUFFER FROM THE DATABASE FILE
				const imgBuffer = Buffer.from(update.fileData, 'base64');

				// NAVIGATE TO THE IMG LOCATION
				const imgLocation = path.join(__dirname, `../public/uploads/${update.fileName}`)

				// WRITE THE NEW BUFFER TO THE IMG LOCATION DEFINED
				fs.writeFileSync(imgLocation, imgBuffer);

				// CREATE A URL FOR THE IMG
				const imgUrl = `${req.protocol}://${req.headers.host}/${update.fileName}`;

				// ADD THE NEW URL
				update.fileUrl = imgUrl;

				// PUSH THE CHANGED UPDATE TO THE NEW ARRAY OF UPDATES
				decodedUpdates.push(update)
			} catch (err) {
				return req.json({ status: 400, msg: err })
			}


		} else {
			// PUSH THE CHANGED UPDATE TO THE NEW ARRAY OF UPDATES
			decodedUpdates.push(update)
		}
	});

	return decodedUpdates;
}

module.exports = decodeFile; 