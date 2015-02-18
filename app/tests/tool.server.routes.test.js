'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tool = mongoose.model('Tool'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tool;

/**
 * Tool routes tests
 */
describe('Tool CRUD tests', function() {
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

		// Save a user to the test db and create new Tool
		user.save(function() {
			tool = {
				name: 'Tool Name'
			};

			done();
		});
	});

	it('should be able to save Tool instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tool
				agent.post('/tools')
					.send(tool)
					.expect(200)
					.end(function(toolSaveErr, toolSaveRes) {
						// Handle Tool save error
						if (toolSaveErr) done(toolSaveErr);

						// Get a list of Tools
						agent.get('/tools')
							.end(function(toolsGetErr, toolsGetRes) {
								// Handle Tool save error
								if (toolsGetErr) done(toolsGetErr);

								// Get Tools list
								var tools = toolsGetRes.body;

								// Set assertions
								(tools[0].user._id).should.equal(userId);
								(tools[0].name).should.match('Tool Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tool instance if not logged in', function(done) {
		agent.post('/tools')
			.send(tool)
			.expect(401)
			.end(function(toolSaveErr, toolSaveRes) {
				// Call the assertion callback
				done(toolSaveErr);
			});
	});

	it('should not be able to save Tool instance if no name is provided', function(done) {
		// Invalidate name field
		tool.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tool
				agent.post('/tools')
					.send(tool)
					.expect(400)
					.end(function(toolSaveErr, toolSaveRes) {
						// Set message assertion
						(toolSaveRes.body.message).should.match('Please fill Tool name');
						
						// Handle Tool save error
						done(toolSaveErr);
					});
			});
	});

	it('should be able to update Tool instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tool
				agent.post('/tools')
					.send(tool)
					.expect(200)
					.end(function(toolSaveErr, toolSaveRes) {
						// Handle Tool save error
						if (toolSaveErr) done(toolSaveErr);

						// Update Tool name
						tool.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tool
						agent.put('/tools/' + toolSaveRes.body._id)
							.send(tool)
							.expect(200)
							.end(function(toolUpdateErr, toolUpdateRes) {
								// Handle Tool update error
								if (toolUpdateErr) done(toolUpdateErr);

								// Set assertions
								(toolUpdateRes.body._id).should.equal(toolSaveRes.body._id);
								(toolUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tools if not signed in', function(done) {
		// Create new Tool model instance
		var toolObj = new Tool(tool);

		// Save the Tool
		toolObj.save(function() {
			// Request Tools
			request(app).get('/tools')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tool if not signed in', function(done) {
		// Create new Tool model instance
		var toolObj = new Tool(tool);

		// Save the Tool
		toolObj.save(function() {
			request(app).get('/tools/' + toolObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tool.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tool instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tool
				agent.post('/tools')
					.send(tool)
					.expect(200)
					.end(function(toolSaveErr, toolSaveRes) {
						// Handle Tool save error
						if (toolSaveErr) done(toolSaveErr);

						// Delete existing Tool
						agent.delete('/tools/' + toolSaveRes.body._id)
							.send(tool)
							.expect(200)
							.end(function(toolDeleteErr, toolDeleteRes) {
								// Handle Tool error error
								if (toolDeleteErr) done(toolDeleteErr);

								// Set assertions
								(toolDeleteRes.body._id).should.equal(toolSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tool instance if not signed in', function(done) {
		// Set Tool user 
		tool.user = user;

		// Create new Tool model instance
		var toolObj = new Tool(tool);

		// Save the Tool
		toolObj.save(function() {
			// Try deleting Tool
			request(app).delete('/tools/' + toolObj._id)
			.expect(401)
			.end(function(toolDeleteErr, toolDeleteRes) {
				// Set message assertion
				(toolDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tool error error
				done(toolDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tool.remove().exec();
		done();
	});
});