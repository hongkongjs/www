// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'jobs' module unit test suite
describe('Testing Jobs Controller', function() {
  // Define global variables
  var _scope, JobsController;

  // Define a pre-tests function
  beforeEach(function() {
    // Load the 'mean' module
    module('mean');

    // Add a new Jasmine matcher
    jasmine.addMatchers({
      toEqualData: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            return {
              pass: angular.equals(actual, expected)
            };
          }
        };
      }
    });

    // Use the 'inject' method to inject services
    inject(function($rootScope, $controller) {
      // Create a mock scope object
      _scope = $rootScope.$new();

      // Create a new mock controller
      JobsController = $controller('JobsController', {
        $scope: _scope
      });
    });
  });

  // Test the 'find' method
  it('Should have a find method that uses $resource to retrieve a list of jobs', inject(function(Jobs) {
    // Use the 'inject' method to inject services
    inject(function($httpBackend) {
      // Create a sample job
      var sampleJob = new Jobs({
        title: 'A job about MEAN',
        description: 'MEAN rocks!'
      });

      // Create a sample jobs list
      var sampleJobs = [sampleJob];

      // Define a request assertion
      $httpBackend.expectGET('api/jobs').respond(sampleJobs);

      // Call the controller's 'find' method
      _scope.find();

      // Flush the mock HTTP results
      $httpBackend.flush();

      // Test the results
      expect(_scope.jobs).toEqualData(sampleJobs);
    });
  }));

  // Test the 'findOne' method
  it('Should have a findOne method that uses $resource to retreive a single of job', inject(function(Jobs) {
    // Use the 'inject' method to inject services
    inject(function($httpBackend, $routeParams) {
      // Create a sample job
      var sampleJob = new Jobs({
        title: 'A job about MEAN',
        description: 'MEAN rocks!'
      });

      // Set the 'jobId' route parameter
      $routeParams.jobId = 'abcdef123456789012345678';

      // Define a request assertion
      $httpBackend.expectGET(/api\/jobs\/([0-9a-fA-F]{24})$/).respond(sampleJob);

      // Call the controller's 'findOne' method
      _scope.findOne();

      // Flush the mock HTTP results
      $httpBackend.flush();

      // Test the results
      expect(_scope.job).toEqualData(sampleJob);
    });
  }));
});
