'use strict';

(function() {
  // News Controller Spec
  describe('News Controller Tests', function() {
    // Initialize global variables
    var NewsController,
    scope,
    $httpBackend,
    $stateParams,
    $location;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function() {
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
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;

      // Initialize the News controller.
      NewsController = $controller('NewsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one News object fetched from XHR', inject(function(News) {
      // Create sample News using the News service
      var sampleNew = new News({
        name: 'New News'
      });

      // Create a sample News array that includes the new News
      var sampleNews = [sampleNew];

      // Set GET response
      $httpBackend.expectGET('news').respond(sampleNews);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.news).toEqualData(sampleNews);
    }));

    it('$scope.findOne() should create an array with one News object fetched from XHR using a newsId URL parameter', inject(function(News) {
      // Define a sample News object
      var sampleNews = new News({
        name: 'New News'
      });

      // Set the URL parameter
      $stateParams.newsId = '525a8422f6d0f87f0e407a33';

      // Set GET response
      $httpBackend.expectGET(/news\/([0-9a-fA-F]{24})$/).respond(sampleNews);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.news).toEqualData(sampleNews);
    }));

    it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(News) {
      // Create a sample News object
      var sampleNewsPostData = new News({
        name: 'New News'
      });

      // Create a sample News response
      var sampleNewsResponse = new News({
        _id: '525cf20451979dea2c000001',
        name: 'New News'
      });

      // Fixture mock form input values
      scope.name = 'New News';

      // Set POST response
      $httpBackend.expectPOST('news', sampleNewsPostData).respond(sampleNewsResponse);

      // Run controller functionality
      scope.create();
      $httpBackend.flush();

      // Test form inputs are reset
      expect(scope.name).toEqual('');

      // Test URL redirection after the News was created
      expect($location.path()).toBe('/news/' + sampleNewsResponse._id);
    }));

    it('$scope.update() should update a valid News', inject(function(News) {
      // Define a sample News put data
      var sampleNewsPutData = new News({
        _id: '525cf20451979dea2c000001',
        name: 'New News'
      });

      // Mock News in scope
      scope.news = sampleNewsPutData;

      // Set PUT response
      $httpBackend.expectPUT(/news\/([0-9a-fA-F]{24})$/).respond();

      // Run controller functionality
      scope.update();
      $httpBackend.flush();

      // Test URL location to new object
      expect($location.path()).toBe('/news/' + sampleNewsPutData._id);
    }));

    it('$scope.remove() should send a DELETE request with a valid newsId and remove the News from the scope', inject(function(News) {
      // Create new News object
      var sampleNews = new News({
        _id: '525a8422f6d0f87f0e407a33'
      });

      // Create new News array and include the News
      scope.news = [sampleNews];

      // Set expected DELETE response
      $httpBackend.expectDELETE(/news\/([0-9a-fA-F]{24})$/).respond(204);

      // Run controller functionality
      scope.remove(sampleNews);
      $httpBackend.flush();

      // Test array after successful delete
      expect(scope.news.length).toBe(0);
    }));
  });
}());
