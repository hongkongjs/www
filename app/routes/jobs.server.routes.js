// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
  jobs = require('../../app/controllers/jobs.server.controller');

// Define the routes module' method
module.exports = function(app) {
  // Set up the 'jobs' base routes
  app.route('/api/jobs')
     .get(jobs.list)
     .post(users.requiresLogin, jobs.create);

  // Set up the 'jobs' parameterized routes
  app.route('/api/jobs/:jobId')
     .get(jobs.read)
     .put(users.requiresLogin, jobs.hasAuthorization, jobs.update)
     .delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);

  // Set up the 'jobId' parameter middleware
  app.param('jobId', jobs.jobByID);
};
