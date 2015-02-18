'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tool Schema
 */
var ToolSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tool name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tool', ToolSchema);