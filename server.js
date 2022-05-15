const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// IMPORT ROUTES
const kontaktRoute = require('./routes/kontaktRoute');
const loginRoute = require('./routes/loginRoute');

// USE IMPORTED ROUTES
app.use('/kontakt', kontaktRoute);
app.use('/login', loginRoute);

// TESTING PURPOSE
app.get('/', (req, res) => {
	res.status(200).json('Server is working great');
});

// START SERVER
app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));