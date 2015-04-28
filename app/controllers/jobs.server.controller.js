// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
  Job = mongoose.model('Job');

// Create a new error handling controller method
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

// Create a new controller method that creates new jobs
exports.create = function(req, res) {
  // Create a new job object
  var job = new Job(req.body);

  // Set the job's 'creator' property
  job.creator = req.user;

  // Try saving the job
  job.save(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the job
      res.json(job);
    }
  });
};

// Create a new controller method that retrieves a list of jobs
exports.list = function(req, res) {
  // Use the model 'find' method to get a list of jobs
  Job.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, jobs) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the job
      res.json(jobs);
    }
  });
};

// Create a new controller method that returns an existing job
exports.read = function(req, res) {
  res.json(req.job);
};

// Create a new controller method that updates an existing job
exports.update = function(req, res) {
  // Get the job from the 'request' object
  var job = req.job;

  // Update the job fields
  job.title = req.body.title;
  job.description = req.body.description;

  // Try saving the updated job
  job.save(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the job
      res.json(job);
    }
  });
};

// Create a new controller method that delete an existing job
exports.delete = function(req, res) {
  // Get the job from the 'request' object
  var job = req.job;

  // Use the model 'remove' method to delete the job
  job.remove(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the job
      res.json(job);
    }
  });
};

// Create a new controller middleware that retrieves a single existing job
exports.jobByID = function(req, res, next, id) {
  // Use the model 'findById' method to find a single job
  Job.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, job) {
    if (err) return next(err);
    if (!job) return next(new Error('Failed to load job ' + id));

    // If an job is found use the 'request' object to pass it to the next middleware
    req.job = job;

    // Call the next middleware
    next();
  });
};

// Create a new controller middleware that is used to authorize an job operation
exports.hasAuthorization = function(req, res, next) {
  // If the current user is not the creator of the job send the appropriate error message
  if (req.job.creator.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }

  // Call the next middleware
  next();
};
