//// Imports ////
const express = require('express');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

//// Global constant parameters ////
const params = {
	port: 5000,
	secretKey: 'Generate a key please'
};
Object.freeze(params);

app.use(express.json());

// Static content
app.use(express.static(__dirname + '/public'));

// Get main page
app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, 'public/pages/homePage.html'));
});

// GET Sign Up page
app.get('/signup', (_, res) => {
	res.sendFile(path.join(__dirname, 'public/pages/signup.html'));
});

// Listen on port
app.listen(params.port, () => {
	console.log(`Started on ${params.port}`);
});
