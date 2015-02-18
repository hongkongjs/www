'use strict';

//Setting up route
angular.module('news').config(['$stateProvider',
	function($stateProvider) {
		// News state routing
		$stateProvider.
		state('listNews', {
			url: '/news',
			templateUrl: 'modules/news/views/list-news.client.view.html'
		}).
		state('createNews', {
			url: '/news/create',
			templateUrl: 'modules/news/views/create-news.client.view.html'
		}).
		state('viewNews', {
			url: '/news/:newsId',
			templateUrl: 'modules/news/views/view-news.client.view.html'
		}).
		state('editNews', {
			url: '/news/:newsId/edit',
			templateUrl: 'modules/news/views/edit-news.client.view.html'
		});
	}
]);