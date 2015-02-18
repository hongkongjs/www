'use strict';

(function() {
	// Stacks Controller Spec
	describe('Stacks Controller Tests', function() {
		// Initialize global variables
		var StacksController,
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

			// Initialize the Stacks controller.
			StacksController = $controller('StacksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Stack object fetched from XHR', inject(function(Stacks) {
			// Create sample Stack using the Stacks service
			var sampleStack = new Stacks({
				name: 'New Stack'
			});

			// Create a sample Stacks array that includes the new Stack
			var sampleStacks = [sampleStack];

			// Set GET response
			$httpBackend.expectGET('stacks').respond(sampleStacks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stacks).toEqualData(sampleStacks);
		}));

		it('$scope.findOne() should create an array with one Stack object fetched from XHR using a stackId URL parameter', inject(function(Stacks) {
			// Define a sample Stack object
			var sampleStack = new Stacks({
				name: 'New Stack'
			});

			// Set the URL parameter
			$stateParams.stackId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stacks\/([0-9a-fA-F]{24})$/).respond(sampleStack);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stack).toEqualData(sampleStack);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stacks) {
			// Create a sample Stack object
			var sampleStackPostData = new Stacks({
				name: 'New Stack'
			});

			// Create a sample Stack response
			var sampleStackResponse = new Stacks({
				_id: '525cf20451979dea2c000001',
				name: 'New Stack'
			});

			// Fixture mock form input values
			scope.name = 'New Stack';

			// Set POST response
			$httpBackend.expectPOST('stacks', sampleStackPostData).respond(sampleStackResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Stack was created
			expect($location.path()).toBe('/stacks/' + sampleStackResponse._id);
		}));

		it('$scope.update() should update a valid Stack', inject(function(Stacks) {
			// Define a sample Stack put data
			var sampleStackPutData = new Stacks({
				_id: '525cf20451979dea2c000001',
				name: 'New Stack'
			});

			// Mock Stack in scope
			scope.stack = sampleStackPutData;

			// Set PUT response
			$httpBackend.expectPUT(/stacks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stacks/' + sampleStackPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stackId and remove the Stack from the scope', inject(function(Stacks) {
			// Create new Stack object
			var sampleStack = new Stacks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stacks array and include the Stack
			scope.stacks = [sampleStack];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stacks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStack);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stacks.length).toBe(0);
		}));
	});
}());