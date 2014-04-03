// script.js
// create the module and name it votingApp
var votingApp = angular.module('votingApp', ['ui.bootstrap', 'ngCsv', 'ngSanitize']);

// configure our routes
votingApp.config(function($routeProvider, $httpProvider) {
	//initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

	$routeProvider
		// route for the login page
		.when('/', {
			templateUrl : 'pages/login.html',
			controller  : 'loginController'
		})
		//routeto the chili page
		.when('/admin', {
			templateUrl : 'pages/admin.html',
			controller  : 'adminController'
		})
		//routeto the voting page
		.when('/voting', {
			templateUrl : 'pages/voting.html',
			controller  : 'votingController'
		});
});