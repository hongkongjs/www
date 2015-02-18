'use strict';

angular.module('core').controller('SideNavController', ['$scope', '$mdSidenav',
  function($scope, $mdSidenav){

    $scope.selected      = null;

    $scope.menuItems = [
      {
        name: 'News',
        url: '#!/news'
      },
      {
        name: 'Share Stack',
        url: '#!/stack'
       },
      {
        name: 'Browse Tools',
        url: '#!/tools'
      },
      {
        name: 'Settings',
        url: '#!/settings'
      },
      {
        name: 'Help & Feedback',
        url: '#!/feedback'
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
