const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadImageAndGetUrl = async (image) => {
	try {
		// UPLOAD THE FILE TO S3
		const newImage = await s3.putObject({
			Body: Buffer.from(image.data),
			Bucket: process.env.BUCKET,
			Key: image.name,
		}).promise();

		// GET THE URL OF THE UPLOADED IMAGE
		const imageUrl = await s3.getSignedUrl('getObject', {
			Bucket: process.env.BUCKET,
			Key: image.name,
		});
		return { url: imageUrl, key: image.name };
	} catch (err) {
		// RETURN THE ERROR
		console.log(err);
		return err
	}

}

module.exports = uploadImageAndGetUrl;