'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Stack = mongoose.model('Stack'),
	_ = require('lodash');

/**
 * Create a Stack
 */
exports.create = function(req, res) {
	var stack = new Stack(req.body);
	stack.user = req.user;

	stack.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stack);
		}
	});
};

/**
 * Show the current Stack
 */
exports.read = function(req, res) {
	res.jsonp(req.stack);
};

/**
 * Update a Stack
 */
exports.update = function(req, res) {
	var stack = req.stack ;

	stack = _.extend(stack , req.body);

	stack.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stack);
		}
	});
};

/**
 * Delete an Stack
 */
exports.delete = function(req, res) {
	var stack = req.stack ;

	stack.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stack);
		}
	});
};

/**
 * List of Stacks
 */
exports.list = function(req, res) { 
	Stack.find().sort('-created').populate('user', 'displayName').exec(function(err, stacks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stacks);
		}
	});
};

/**
 * Stack middleware
 */
exports.stackByID = function(req, res, next, id) { 
	Stack.findById(id).populate('user', 'displayName').exec(function(err, stack) {
		if (err) return next(err);
		if (! stack) return next(new Error('Failed to load Stack ' + id));
		req.stack = stack ;
		next();
	});
};

/**
 * Stack authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stack.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
