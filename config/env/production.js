// Invoke 'strict' JavaScript mode
'use strict';

console.log('production');

// Set the 'production' environment configuration object
module.exports = {
  db: 'mongodb://' + process.env.MONGODB_URI,
  sessionSecret: 'productionSessionSecret',
  facebook: {
    clientID: 'Facebook Application ID',
    clientSecret: 'Facebook Application Secret',
    callbackURL: 'http://localhost:3000/oauth/facebook/callback'
  },
  twitter: {
    clientID: 'Twitter Application ID',
    clientSecret: 'Twitter Application Secret',
    callbackURL: 'http://localhost:3000/oauth/twitter/callback'
  },
  google: {
    clientID: 'Google Application ID',
    clientSecret: 'Google Application Secret',
    callbackURL: 'http://localhost:3000/oauth/google/callback'
  }
};
