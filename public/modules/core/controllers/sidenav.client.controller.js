'use strict';

angular.module('core').controller('SideNavController', ['$scope', '$mdSidenav',
  function($scope, $mdSidenav){
    $scope.menuItems = [
      {
        name: 'News',
      },
      {
        name: 'Share Stack',
       },
      {
        name: 'Browse Tools',
      },
      {
        name: 'Settings',
      },
      {
        name: 'Help & Feedback',
      }
    ];

    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.selectItem = function (item) {
      $scope.selected = angular.isNumber(item) ? $scope.menuItems[item] : item;
      $scope.toggleSidenav('left');
    };
  }
]);
