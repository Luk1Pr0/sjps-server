const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// DATABASE
const mongoose = require('mongoose');

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// IMPORT ROUTES
const kontaktRoute = require('./routes/kontaktRoute');
const loginRoute = require('./routes/loginRoute');
const aktualnosciRoute = require('./routes/aktualnosciRoute');

// USE IMPORTED ROUTES
app.use('/kontakt/', kontaktRoute);
app.use('/login/', loginRoute);
app.use('/aktualnosci/', aktualnosciRoute);

// TESTING PURPOSE
app.get('/', (req, res) => {
	res.status(200).json('Server is working great');
});

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on('connected', () => console.log('Connected to DB'));
mongoose.connection.on('error', () => console.log('Error connecting to DB'));

// START SERVER
app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));