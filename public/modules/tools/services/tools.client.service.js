'use strict';

//Tools service used to communicate Tools REST endpoints
angular.module('tools').factory('Tools', ['$resource',
	function($resource) {
		return $resource('tools/:toolId', { toolId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);