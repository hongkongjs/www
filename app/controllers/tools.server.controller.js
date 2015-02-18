'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tool = mongoose.model('Tool'),
	_ = require('lodash');

/**
 * Create a Tool
 */
exports.create = function(req, res) {
	var tool = new Tool(req.body);
	tool.user = req.user;

	tool.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tool);
		}
	});
};

/**
 * Show the current Tool
 */
exports.read = function(req, res) {
	res.jsonp(req.tool);
};

/**
 * Update a Tool
 */
exports.update = function(req, res) {
	var tool = req.tool ;

	tool = _.extend(tool , req.body);

	tool.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tool);
		}
	});
};

/**
 * Delete an Tool
 */
exports.delete = function(req, res) {
	var tool = req.tool ;

	tool.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tool);
		}
	});
};

/**
 * List of Tools
 */
exports.list = function(req, res) { 
	Tool.find().sort('-created').populate('user', 'displayName').exec(function(err, tools) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tools);
		}
	});
};

/**
 * Tool middleware
 */
exports.toolByID = function(req, res, next, id) { 
	Tool.findById(id).populate('user', 'displayName').exec(function(err, tool) {
		if (err) return next(err);
		if (! tool) return next(new Error('Failed to load Tool ' + id));
		req.tool = tool ;
		next();
	});
};

/**
 * Tool authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tool.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
