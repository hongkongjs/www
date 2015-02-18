'use strict';

//Setting up route
angular.module('tools').config(['$stateProvider',
	function($stateProvider) {
		// Tools state routing
		$stateProvider.
		state('listTools', {
			url: '/tools',
			templateUrl: 'modules/tools/views/list-tools.client.view.html'
		}).
		state('createTool', {
			url: '/tools/create',
			templateUrl: 'modules/tools/views/create-tool.client.view.html'
		}).
		state('viewTool', {
			url: '/tools/:toolId',
			templateUrl: 'modules/tools/views/view-tool.client.view.html'
		}).
		state('editTool', {
			url: '/tools/:toolId/edit',
			templateUrl: 'modules/tools/views/edit-tool.client.view.html'
		});
	}
]);