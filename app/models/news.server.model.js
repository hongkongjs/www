'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * News Schema
 */
var NewsSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill News name',
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

mongoose.model('News', NewsSchema);