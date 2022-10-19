const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadImageAndGetUrl = async (image) => {
	try {
		// UPLOAD THE FILE TO S3
		const newImage = await s3.upload({
			Body: Buffer.from(image.data),
			Bucket: process.env.AWS_BUCKET,
			Key: image.name,
		}).promise();

		console.log(newImage.Location);

		// GET THE URL OF THE UPLOADED IMAGE
		// const imageUrl = `https://s3-${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET}/${image.name}`
		
		return { url: newImage.Location, key: image.name };
	} catch (err) {
		// RETURN THE ERROR
		console.log('Error in uploadImage', err);
		return err
	}

}

module.exports = uploadImageAndGetUrl;