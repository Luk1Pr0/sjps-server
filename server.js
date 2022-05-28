const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// DATABASE
const mongoose = require('mongoose');

// MIDDLEWARE
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static(__dirname + '../public'));

// IMPORT ROUTES
const kontaktRoute = require('./routes/kontaktRoute');
const loginRoute = require('./routes/loginRoute');
const aktualnosciRoute = require('./routes/aktualnosciRoute');

// OPTIONS
const fileUploadOptions = {
	// uriDecodeFileNames: true,
	createParentPath: true,
}

// USE IMPORTED ROUTES
app.use('/kontakt/', kontaktRoute);
app.use('/login/', loginRoute);
// PARSE THE FILE FROM FORM VIA FORMIDABLE
app.use('/aktualnosci/', fileUpload(fileUploadOptions), aktualnosciRoute);

// TESTING PURPOSE
app.get('/', (req, res) => {
	res.status(200).json('Server is working great');
});

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on('connected', () => console.log('Connected to DB'));
mongoose.connection.on('error', () => console.log('Error connecting to DB'));

// START SERVER
app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));