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

// Get main page
app.use(express.static(__dirname + '/public'));

// Listen on port
app.listen(params.port, () => {
	console.log(`Started on ${params.port}`);
});
