// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'jobs' controller
angular.module('jobs').controller('JobsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Jobs',
    function($scope, $routeParams, $location, Authentication, Jobs) {
      // Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new jobs
        $scope.create = function() {
          // Use the form fields to create a new job $resource object
            var job = new Jobs({
                title: this.title,
                description: this.description
            });

            // Use the job '$save' method to send an appropriate POST request
            job.$save(function(response) {
              // If an job was created successfully, redirect the user to the job's page
                $location.path('jobs/' + response._id);
            }, function(errorResponse) {
              // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of jobs
        $scope.find = function() {
          // Use the job 'query' method to send an appropriate GET request
            $scope.jobs = Jobs.query();
        };

        // Create a new controller method for retrieving a single job
        $scope.findOne = function() {
          // Use the job 'get' method to send an appropriate GET request
            $scope.job = Jobs.get({
                jobId: $routeParams.jobId
            });
        };

        // Create a new controller method for updating a single job
        $scope.update = function() {
          // Use the job '$update' method to send an appropriate PUT request
            $scope.job.$update(function() {
              // If an job was updated successfully, redirect the user to the job's page
                $location.path('jobs/' + $scope.job._id);
            }, function(errorResponse) {
              // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single job
        $scope.delete = function(job) {
          // If an job was sent to the method, delete it
            if (job) {
              // Use the job '$remove' method to delete the job
                job.$remove(function() {
                  // Remove the job from the jobs list
                    for (var i in $scope.jobs) {
                        if ($scope.jobs[i] === job) {
                            $scope.jobs.splice(i, 1);
                        }
                    }
                });
            } else {
              // Otherwise, use the job '$remove' method to delete the job
                $scope.job.$remove(function() {
                    $location.path('jobs');
                });
            }
        };
    }
]);
