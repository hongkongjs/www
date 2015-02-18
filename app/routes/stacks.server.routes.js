'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stacks = require('../../app/controllers/stacks.server.controller');

	// Stacks Routes
	app.route('/stacks')
		.get(stacks.list)
		.post(users.requiresLogin, stacks.create);

	app.route('/stacks/:stackId')
		.get(stacks.read)
		.put(users.requiresLogin, stacks.hasAuthorization, stacks.update)
		.delete(users.requiresLogin, stacks.hasAuthorization, stacks.delete);

	// Finish by binding the Stack middleware
	app.param('stackId', stacks.stackByID);
};
