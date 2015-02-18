'use strict';

(function() {
	// Tools Controller Spec
	describe('Tools Controller Tests', function() {
		// Initialize global variables
		var ToolsController,
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

			// Initialize the Tools controller.
			ToolsController = $controller('ToolsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tool object fetched from XHR', inject(function(Tools) {
			// Create sample Tool using the Tools service
			var sampleTool = new Tools({
				name: 'New Tool'
			});

			// Create a sample Tools array that includes the new Tool
			var sampleTools = [sampleTool];

			// Set GET response
			$httpBackend.expectGET('tools').respond(sampleTools);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tools).toEqualData(sampleTools);
		}));

		it('$scope.findOne() should create an array with one Tool object fetched from XHR using a toolId URL parameter', inject(function(Tools) {
			// Define a sample Tool object
			var sampleTool = new Tools({
				name: 'New Tool'
			});

			// Set the URL parameter
			$stateParams.toolId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tools\/([0-9a-fA-F]{24})$/).respond(sampleTool);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tool).toEqualData(sampleTool);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tools) {
			// Create a sample Tool object
			var sampleToolPostData = new Tools({
				name: 'New Tool'
			});

			// Create a sample Tool response
			var sampleToolResponse = new Tools({
				_id: '525cf20451979dea2c000001',
				name: 'New Tool'
			});

			// Fixture mock form input values
			scope.name = 'New Tool';

			// Set POST response
			$httpBackend.expectPOST('tools', sampleToolPostData).respond(sampleToolResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tool was created
			expect($location.path()).toBe('/tools/' + sampleToolResponse._id);
		}));

		it('$scope.update() should update a valid Tool', inject(function(Tools) {
			// Define a sample Tool put data
			var sampleToolPutData = new Tools({
				_id: '525cf20451979dea2c000001',
				name: 'New Tool'
			});

			// Mock Tool in scope
			scope.tool = sampleToolPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tools\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tools/' + sampleToolPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid toolId and remove the Tool from the scope', inject(function(Tools) {
			// Create new Tool object
			var sampleTool = new Tools({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tools array and include the Tool
			scope.tools = [sampleTool];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tools\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTool);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tools.length).toBe(0);
		}));
	});
}());