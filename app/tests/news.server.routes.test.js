'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	News = mongoose.model('News'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, news;

/**
 * News routes tests
 */
describe('News CRUD tests', function() {
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

		// Save a user to the test db and create new News
		user.save(function() {
			news = {
				name: 'News Name'
			};

			done();
		});
	});

	it('should be able to save News instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News
				agent.post('/news')
					.send(news)
					.expect(200)
					.end(function(newsSaveErr, newsSaveRes) {
						// Handle News save error
						if (newsSaveErr) done(newsSaveErr);

						// Get a list of News
						agent.get('/news')
							.end(function(newsGetErr, newsGetRes) {
								// Handle News save error
								if (newsGetErr) done(newsGetErr);

								// Get News list
								var news = newsGetRes.body;

								// Set assertions
								(news[0].user._id).should.equal(userId);
								(news[0].name).should.match('News Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save News instance if not logged in', function(done) {
		agent.post('/news')
			.send(news)
			.expect(401)
			.end(function(newsSaveErr, newsSaveRes) {
				// Call the assertion callback
				done(newsSaveErr);
			});
	});

	it('should not be able to save News instance if no name is provided', function(done) {
		// Invalidate name field
		news.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News
				agent.post('/news')
					.send(news)
					.expect(400)
					.end(function(newsSaveErr, newsSaveRes) {
						// Set message assertion
						(newsSaveRes.body.message).should.match('Please fill News name');
						
						// Handle News save error
						done(newsSaveErr);
					});
			});
	});

	it('should be able to update News instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News
				agent.post('/news')
					.send(news)
					.expect(200)
					.end(function(newsSaveErr, newsSaveRes) {
						// Handle News save error
						if (newsSaveErr) done(newsSaveErr);

						// Update News name
						news.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing News
						agent.put('/news/' + newsSaveRes.body._id)
							.send(news)
							.expect(200)
							.end(function(newsUpdateErr, newsUpdateRes) {
								// Handle News update error
								if (newsUpdateErr) done(newsUpdateErr);

								// Set assertions
								(newsUpdateRes.body._id).should.equal(newsSaveRes.body._id);
								(newsUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of News if not signed in', function(done) {
		// Create new News model instance
		var newsObj = new News(news);

		// Save the News
		newsObj.save(function() {
			// Request News
			request(app).get('/news')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single News if not signed in', function(done) {
		// Create new News model instance
		var newsObj = new News(news);

		// Save the News
		newsObj.save(function() {
			request(app).get('/news/' + newsObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', news.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete News instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News
				agent.post('/news')
					.send(news)
					.expect(200)
					.end(function(newsSaveErr, newsSaveRes) {
						// Handle News save error
						if (newsSaveErr) done(newsSaveErr);

						// Delete existing News
						agent.delete('/news/' + newsSaveRes.body._id)
							.send(news)
							.expect(200)
							.end(function(newsDeleteErr, newsDeleteRes) {
								// Handle News error error
								if (newsDeleteErr) done(newsDeleteErr);

								// Set assertions
								(newsDeleteRes.body._id).should.equal(newsSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete News instance if not signed in', function(done) {
		// Set News user 
		news.user = user;

		// Create new News model instance
		var newsObj = new News(news);

		// Save the News
		newsObj.save(function() {
			// Try deleting News
			request(app).delete('/news/' + newsObj._id)
			.expect(401)
			.end(function(newsDeleteErr, newsDeleteRes) {
				// Set message assertion
				(newsDeleteRes.body.message).should.match('User is not logged in');

				// Handle News error error
				done(newsDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		News.remove().exec();
		done();
	});
});