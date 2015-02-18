'use strict';

angular.module('core').controller('SideNavController', ['$scope', '$mdSidenav', '$location',
  function($scope, $mdSidenav, $location){

    $scope.selected      = null;

    $scope.menuItems = [
      {
        name: 'News',
        url: '/news'
      },
      {
        name: 'Share Stack',
        url: '/stacks'
       },
      {
        name: 'Browse Tools',
        url: '/tools'
      },
      {
        name: 'Settings',
        url: '/settings'
      },
      {
        name: 'Help & Feedback',
        url: '/feedback'
      }
    ];

    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.selectItem = function(path) {
      $location.path(path);
      $scope.toggleSidenav('left');
    };
  }
]);
