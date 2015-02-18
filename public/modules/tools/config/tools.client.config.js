'use strict';

// Configuring the Articles module
angular.module('tools').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tools', 'tools', 'dropdown', '/tools(/create)?');
		Menus.addSubMenuItem('topbar', 'tools', 'List Tools', 'tools');
		Menus.addSubMenuItem('topbar', 'tools', 'New Tool', 'tools/create');
	}
]);