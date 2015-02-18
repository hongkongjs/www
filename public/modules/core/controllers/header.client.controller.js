'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', '$mdSidenav',
  function($scope, Authentication, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.authentication = Authentication;
  }
]);
