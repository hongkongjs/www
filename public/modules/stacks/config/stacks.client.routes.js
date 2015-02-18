'use strict';

//Setting up route
angular.module('stacks').config(['$stateProvider',
	function($stateProvider) {
		// Stacks state routing
		$stateProvider.
		state('listStacks', {
			url: '/stacks',
			templateUrl: 'modules/stacks/views/list-stacks.client.view.html'
		}).
		state('createStack', {
			url: '/stacks/create',
			templateUrl: 'modules/stacks/views/create-stack.client.view.html'
		}).
		state('viewStack', {
			url: '/stacks/:stackId',
			templateUrl: 'modules/stacks/views/view-stack.client.view.html'
		}).
		state('editStack', {
			url: '/stacks/:stackId/edit',
			templateUrl: 'modules/stacks/views/edit-stack.client.view.html'
		});
	}
]);