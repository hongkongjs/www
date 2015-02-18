'use strict';

//Stacks service used to communicate Stacks REST endpoints
angular.module('stacks').factory('Stacks', ['$resource',
	function($resource) {
		return $resource('stacks/:stackId', { stackId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);