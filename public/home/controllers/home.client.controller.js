// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('home').controller('HomeController', ['$scope', 'Authentication', 'Articles',
  function($scope, Authentication, Articles) {
    // Expose the authentication service
    $scope.authentication = Authentication;

   $scope.articles = function() {
   	$scope.articles = Articles.query();
   };
  }
]);
