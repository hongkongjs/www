'use strict';

// Configuring the Articles module
angular.module('stacks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stacks', 'stacks', 'dropdown', '/stacks(/create)?');
		Menus.addSubMenuItem('topbar', 'stacks', 'List Stacks', 'stacks');
		Menus.addSubMenuItem('topbar', 'stacks', 'New Stack', 'stacks/create');
	}
]);