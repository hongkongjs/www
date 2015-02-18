'use strict';

// Tools controller
angular.module('tools').controller('ToolsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tools',
	function($scope, $stateParams, $location, Authentication, Tools) {
		$scope.authentication = Authentication;

		// Create new Tool
		$scope.create = function() {
			// Create new Tool object
			var tool = new Tools ({
				name: this.name
			});

			// Redirect after save
			tool.$save(function(response) {
				$location.path('tools/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tool
		$scope.remove = function(tool) {
			if ( tool ) { 
				tool.$remove();

				for (var i in $scope.tools) {
					if ($scope.tools [i] === tool) {
						$scope.tools.splice(i, 1);
					}
				}
			} else {
				$scope.tool.$remove(function() {
					$location.path('tools');
				});
			}
		};

		// Update existing Tool
		$scope.update = function() {
			var tool = $scope.tool;

			tool.$update(function() {
				$location.path('tools/' + tool._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tools
		$scope.find = function() {
			$scope.tools = Tools.query();
		};

		// Find existing Tool
		$scope.findOne = function() {
			$scope.tool = Tools.get({ 
				toolId: $stateParams.toolId
			});
		};
	}
]);