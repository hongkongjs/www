'use strict';

// Stacks controller
angular.module('stacks').controller('StacksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stacks',
	function($scope, $stateParams, $location, Authentication, Stacks) {
		$scope.authentication = Authentication;

		// Create new Stack
		$scope.create = function() {
			// Create new Stack object
			var stack = new Stacks ({
				name: this.name
			});

			// Redirect after save
			stack.$save(function(response) {
				$location.path('stacks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stack
		$scope.remove = function(stack) {
			if ( stack ) { 
				stack.$remove();

				for (var i in $scope.stacks) {
					if ($scope.stacks [i] === stack) {
						$scope.stacks.splice(i, 1);
					}
				}
			} else {
				$scope.stack.$remove(function() {
					$location.path('stacks');
				});
			}
		};

		// Update existing Stack
		$scope.update = function() {
			var stack = $scope.stack;

			stack.$update(function() {
				$location.path('stacks/' + stack._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stacks
		$scope.find = function() {
			$scope.stacks = Stacks.query();
		};

		// Find existing Stack
		$scope.findOne = function() {
			$scope.stack = Stacks.get({ 
				stackId: $stateParams.stackId
			});
		};
	}
]);