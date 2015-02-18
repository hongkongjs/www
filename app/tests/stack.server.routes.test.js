'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Stack = mongoose.model('Stack'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, stack;

/**
 * Stack routes tests
 */
describe('Stack CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Stack
		user.save(function() {
			stack = {
				name: 'Stack Name'
			};

			done();
		});
	});

	it('should be able to save Stack instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stack
				agent.post('/stacks')
					.send(stack)
					.expect(200)
					.end(function(stackSaveErr, stackSaveRes) {
						// Handle Stack save error
						if (stackSaveErr) done(stackSaveErr);

						// Get a list of Stacks
						agent.get('/stacks')
							.end(function(stacksGetErr, stacksGetRes) {
								// Handle Stack save error
								if (stacksGetErr) done(stacksGetErr);

								// Get Stacks list
								var stacks = stacksGetRes.body;

								// Set assertions
								(stacks[0].user._id).should.equal(userId);
								(stacks[0].name).should.match('Stack Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Stack instance if not logged in', function(done) {
		agent.post('/stacks')
			.send(stack)
			.expect(401)
			.end(function(stackSaveErr, stackSaveRes) {
				// Call the assertion callback
				done(stackSaveErr);
			});
	});

	it('should not be able to save Stack instance if no name is provided', function(done) {
		// Invalidate name field
		stack.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stack
				agent.post('/stacks')
					.send(stack)
					.expect(400)
					.end(function(stackSaveErr, stackSaveRes) {
						// Set message assertion
						(stackSaveRes.body.message).should.match('Please fill Stack name');
						
						// Handle Stack save error
						done(stackSaveErr);
					});
			});
	});

	it('should be able to update Stack instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stack
				agent.post('/stacks')
					.send(stack)
					.expect(200)
					.end(function(stackSaveErr, stackSaveRes) {
						// Handle Stack save error
						if (stackSaveErr) done(stackSaveErr);

						// Update Stack name
						stack.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Stack
						agent.put('/stacks/' + stackSaveRes.body._id)
							.send(stack)
							.expect(200)
							.end(function(stackUpdateErr, stackUpdateRes) {
								// Handle Stack update error
								if (stackUpdateErr) done(stackUpdateErr);

								// Set assertions
								(stackUpdateRes.body._id).should.equal(stackSaveRes.body._id);
								(stackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Stacks if not signed in', function(done) {
		// Create new Stack model instance
		var stackObj = new Stack(stack);

		// Save the Stack
		stackObj.save(function() {
			// Request Stacks
			request(app).get('/stacks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Stack if not signed in', function(done) {
		// Create new Stack model instance
		var stackObj = new Stack(stack);

		// Save the Stack
		stackObj.save(function() {
			request(app).get('/stacks/' + stackObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', stack.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Stack instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stack
				agent.post('/stacks')
					.send(stack)
					.expect(200)
					.end(function(stackSaveErr, stackSaveRes) {
						// Handle Stack save error
						if (stackSaveErr) done(stackSaveErr);

						// Delete existing Stack
						agent.delete('/stacks/' + stackSaveRes.body._id)
							.send(stack)
							.expect(200)
							.end(function(stackDeleteErr, stackDeleteRes) {
								// Handle Stack error error
								if (stackDeleteErr) done(stackDeleteErr);

								// Set assertions
								(stackDeleteRes.body._id).should.equal(stackSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Stack instance if not signed in', function(done) {
		// Set Stack user 
		stack.user = user;

		// Create new Stack model instance
		var stackObj = new Stack(stack);

		// Save the Stack
		stackObj.save(function() {
			// Try deleting Stack
			request(app).delete('/stacks/' + stackObj._id)
			.expect(401)
			.end(function(stackDeleteErr, stackDeleteRes) {
				// Set message assertion
				(stackDeleteRes.body.message).should.match('User is not logged in');

				// Handle Stack error error
				done(stackDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Stack.remove().exec();
		done();
	});
});