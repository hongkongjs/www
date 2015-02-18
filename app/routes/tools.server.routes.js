'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tools = require('../../app/controllers/tools.server.controller');

	// Tools Routes
	app.route('/tools')
		.get(tools.list)
		.post(users.requiresLogin, tools.create);

	app.route('/tools/:toolId')
		.get(tools.read)
		.put(users.requiresLogin, tools.hasAuthorization, tools.update)
		.delete(users.requiresLogin, tools.hasAuthorization, tools.delete);

	// Finish by binding the Tool middleware
	app.param('toolId', tools.toolByID);
};
