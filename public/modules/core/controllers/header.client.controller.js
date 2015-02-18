'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$mdSidenav',
  function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };
  }
]);
