// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'jobs' module E2E test suite
describe('Jobs E2E Tests:', function() {
  // Test the new job page
  describe('New Job Page', function() {
    it('Should not be able to create a new job', function() {
      // Load the new job page
      browser.get('http://localhost:3000/#!/jobs/create');

      // Get the submit button
      element(by.css('input[type=submit]')).click();

      // Get the error message element
      element(by.binding('error')).getText().then(function(errorText) {
        // Check the error message text
        expect(errorText).toBe('User is not logged in');
      });
    });
  });
});
