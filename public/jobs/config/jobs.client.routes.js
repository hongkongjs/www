// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'jobs' module routes
angular.module('jobs').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/jobs', {
      templateUrl: 'jobs/views/list-jobs.client.view.html'
    }).
    when('/jobs/create', {
      templateUrl: 'jobs/views/create-job.client.view.html'
    }).
    when('/jobs/:jobId', {
      templateUrl: 'jobs/views/view-job.client.view.html'
    }).
    when('/jobs/:jobId/edit', {
      templateUrl: 'jobs/views/edit-job.client.view.html'
    });
  }
]);
