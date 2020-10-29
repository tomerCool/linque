//// Imports ////

const express = require('express');
const path = require('path');
const pool = require('./scripts/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('express-validator');

const User = require('./scripts/components/User');
const LinkPreview = require('./scripts/components/LinkPreview');

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
	res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});

// GET signup page
app.get('/signup', (_, res) => {
	res.sendFile(path.join(__dirname, 'public/pages/signup.html'));
});

// POST signup
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

// GET login page
app.get('/login', (_, res) => {
	res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

// POST login
app.post('/login', User.login);

// POST link preview
app.post('/util/linkpreview', /*User.verifyToken,*/ LinkPreview.validateLink, async (req, res, next) => {
	const errors = validator.validationResult(req).array();

	if (errors.length > 0) {
		res.status(400).json({
			inputErrors: errors
		});
	} else {
		const preview = await LinkPreview.getData(req.body.inputUrl);
		if (preview) res.json(preview);
		else res.status(400).json({
			inputErrors: [{
				msg: 'Invalid URL'
			}]
		});
	}
});

// Error handling
app.use((err, req, res, next) => {
	if (err.stack) console.error(err.stack);
  	res.status(err.status || 500).json({
		error: err.msg || ''
	});
});

// Listen on port
app.listen(params.port, async () => {
	console.log(`Started on ${params.port}`);
});
