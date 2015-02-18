'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var news = require('../../app/controllers/news.server.controller');

	// News Routes
	app.route('/news')
		.get(news.list)
		.post(users.requiresLogin, news.create);

	app.route('/news/:newsId')
		.get(news.read)
		.put(users.requiresLogin, news.hasAuthorization, news.update)
		.delete(users.requiresLogin, news.hasAuthorization, news.delete);

	// Finish by binding the News middleware
	app.param('newsId', news.newsByID);
};
