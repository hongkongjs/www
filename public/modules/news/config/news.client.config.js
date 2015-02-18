'use strict';

// Configuring the Articles module
angular.module('news').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'News', 'news', 'dropdown', '/news(/create)?');
		Menus.addSubMenuItem('topbar', 'news', 'List News', 'news');
		Menus.addSubMenuItem('topbar', 'news', 'New News', 'news/create');
	}
]);