const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID_CUSTOM,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_CUSTOM,
	region: process.env.AWS_REGION_CUSTOM,
});

const uploadImageAndGetUrl = async (image) => {
	try {
		console.log('POSTING TO S3 \n', process.env.AWS_ACCESS_KEY_ID_CUSTOM + '\n' + process.env.AWS_SECRET_ACCESS_KEY_CUSTOM)
		// UPLOAD THE FILE TO S3
		const newImage = await s3.putObject({
			Body: Buffer.from(image.data),
			Bucket: process.env.AWS_BUCKET_CUSTOM,
			Key: image.name,
		}).promise();

		console.log('POSTED TO S3')

		// GET THE URL OF THE UPLOADED IMAGE
		const imageUrl = `https://s3-${process.env.AWS_REGION_CUSTOM}.amazonaws.com/${process.env.AWS_BUCKET_CUSTOM}/${image.name}`
		
		return { url: imageUrl, key: image.name };
	} catch (err) {
		// RETURN THE ERROR
		console.log('Error in uploadImage', err);
		return err
	}

}

module.exports = uploadImageAndGetUrl;