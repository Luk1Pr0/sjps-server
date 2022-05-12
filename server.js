const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = 5000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// IMPORT ROUTES
const kontaktRoutes = require('./routes/kontaktRoute');

// USE IMPORTED ROUTES
app.use('/kontakt', kontaktRoutes);

// TESTING PURPOSE
app.get('/', (req, res) => {
	res.status(200).json('Server is working great');
});

// START SERVER
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));