const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	});

const uploadImageAndGetUrl = async (image) => {
	try {
		// UPLOAD THE FILE TO S3
		const newImage = await s3.putObject({
			Body: Buffer.from(image.data),
			Bucket: process.env.AWS_BUCKET,
			Key: image.name,
			ACL: 'public-read'
		}).promise();

		// GET THE URL OF THE UPLOADED IMAGE
		const imageUrl = await s3.getSignedUrl('getObject', {
			Bucket: process.env.AWS_BUCKET,
			Key: image.name,
		});
		return { url: imageUrl, key: image.name };
	} catch (err) {
		// RETURN THE ERROR
		console.log('Error in uploadImage', err);
		return err
	}

}

module.exports = uploadImageAndGetUrl;