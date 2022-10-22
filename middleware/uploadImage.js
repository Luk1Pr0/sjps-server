const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID_CUSTOM,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_CUSTOM,
	region: process.env.AWS_REGION_CUSTOM,
});

const uploadImageAndGetUrl = async (image) => {
	try {
		// UPLOAD THE FILE TO S3
		const newImage = await s3.upload({
			Body: Buffer.from(image.data),
			Bucket: process.env.AWS_BUCKET_CUSTOM,
			Key: image.name,
		}).promise();

		const imageUrl = await newImage.Location;

		console.log("🚀 ~ file: uploadImage.js ~ line 19 ~ uploadImageAndGetUrl ~ imageUrl", imageUrl)

		// GET THE URL OF THE UPLOADED IMAGE
		// const imageUrl = `https://s3-${process.env.AWS_REGION_CUSTOM}.amazonaws.com/${process.env.AWS_BUCKET_CUSTOM}/${image.name}`
		
		return { url: imageUrl, key: image.name };
	} catch (err) {
		// RETURN THE ERROR
		console.log('Error in uploadImage', err);
		return err
	}

}

module.exports = uploadImageAndGetUrl;