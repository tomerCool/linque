const pool = require('../db');
const validator = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userParams = {
	jwt: {
		expiresIn: '10d',
		secretKey: 'Generate key & make this env var'
	},
	username: {
		min: 3,
		max: 20
	},
	password: {
		min: 6,
		max: 30
	},
	displayName: {
		min: 2,
		max: 30
	}
};

const User = {
	create: async (username, password, email, displayName) => {
		const hashedPassword = await bcrypt.hash(password, 10);
		
		const query = await pool.query(
			`INSERT INTO users (username, display_name, password, email, created_at, last_online)
				VALUES ($1, $2, $3, $4, Now(), Now())
				RETURNING *`,
			[username, displayName, hashedPassword, email]
		);
		return await query.rows[0];
	},
	login: async (req, res, next) => {
		const user = await User.find.byUsername(req.body.username);

		if (user && await bcrypt.compare(req.body.password, user.password)) {
			jwt.sign({
				username: user.username
			}, userParams.jwt.secretKey, { expiresIn: userParams.jwt.expiresIn }, (err, token) => {
				if (err) return next({
					stack: err,
					status: 500,
					msg: 'Couldn\'t generate JWT :('
				});

				res.status(200).json({
					token
				});
			});
		} else {
			res.status(400).json({
				inputErrors: [{
					msg: 'Wrong username or password'
				}]
			});
		}
	},
	verifyToken: (req, res, next) => {
		const bearerHeader = req.headers['authorization'];
		if (!bearerHeader || bearerHeader.split(' ').length < 2) res.status(403).json({
			inputErrors: [{
				msg: 'User not logged in'
			}]
		});
	
		const bearerToken = bearerHeader.split(' ')[1];
	
		jwt.verify(bearerToken, userParams.jwt.secretKey, (err, authData) => {
			if (err) res.status(403).json({
				inputErrors: [{
					msg: 'Invalid JWT'
				}]
			});
			req.user = authData.username;
			next();
		});
	},
	find: {
		byUsername: async (username) => {
			const query = await pool.query(
				'SELECT * FROM users WHERE username = $1',
				[username]
			);
			return await query.rows[0];
		},
		byEmail: async (email) => {
			const query = await pool.query(
				'SELECT * FROM users WHERE email = $1',
				[email]
			);
			return await query.rows[0];
		}
	},
	validateSignupData: [
		validator.check('username')
			.notEmpty().withMessage('* Required').bail()
			.isLength({
				min: userParams.username.min,
				max: userParams.username.max
			}).withMessage(`Must be between ${userParams.username.min} and ${userParams.username.max} characters long`)
			.not().matches(/[^A-Za-z0-9-_]/g).withMessage('Must contain only A-Z, a-z, 0-9, -, _')
			.custom(username => {
				return User.find.byUsername(username).then(user => {
					if (user) return Promise.reject('Already taken');
				});
			}),

		validator.check('password')
			.notEmpty().withMessage('* Required').bail()
			.isLength({
				min: userParams.password.min,
				max: userParams.password.max
			}).withMessage(`Must be between ${userParams.password.min} and ${userParams.password.max} characters long`),

		validator.check('email')
			.notEmpty().withMessage('* Required').bail()
			.isEmail().withMessage('Invalid email address')
			.custom(email => {
				return User.find.byEmail(email).then(user => {
					if (user) return Promise.reject('Already in use');
				});
			}),

		validator.check('displayName')
			.notEmpty().withMessage('* Required').bail()
			.isLength({
				min: userParams.displayName.min,
				max: userParams.displayName.max
			}).withMessage(`Must be between ${userParams.displayName.min} and ${userParams.displayName.max} characters long`)
			.not().matches(/[^A-Za-z0-9 ]/g).withMessage('Display name must contain only A-Z, a-z, 0-9'),
	]
}

module.exports = User;