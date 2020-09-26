//// Imports ////

const express = require('express');
const path = require('path');
const pool = require('./scripts/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('express-validator');

const User = require('./scripts/components/User');

const app = express();

//// Global constant parameters ////
// TODO replace with environment variables
const params = {
	port: 5000
}
Object.freeze(params);

app.use(express.json());

// Static content
app.use(express.static(__dirname + '/public'));

// GET main page
app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, 'public/pages/homePage.html'));
});

// GET Sign Up page
app.get('/signup', (_, res) => {
	res.sendFile(path.join(__dirname, 'public/pages/signup.html'));
});

// POST Sign Up
app.post('/signup', User.validateSignupData,
	async (req, res, next) => {
		const errors = validator.validationResult(req).array();

		if (errors.length > 0) {
			res.status(400).json({
				inputErrors: errors
			});
		} else {
			const newUser = await User.create(req.body.username, req.body.password, req.body.email, req.body.displayName);

			if (!newUser) return next({
				status: 500,
				msg: 'Failed to create user'
			});

			next();
		}
	},
	User.login
);

app.post('/login', User.login);

// Error handling
app.use((err, req, res, next) => {
	if (err.stack) console.error(err.stack);
  res.status(err.status).json({
		error: err.msg
	});
});

// Listen on port
app.listen(params.port, async () => {
	console.log(`Started on ${params.port}`);
});
