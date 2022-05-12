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

// START SERVER
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));