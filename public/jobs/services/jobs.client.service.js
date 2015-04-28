// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'jobs' service
angular.module('jobs').factory('Jobs', ['$resource', function($resource) {
  // Use the '$resource' service to return an job '$resource' object
    return $resource('api/jobs/:jobId', {
        jobId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
