// script.js
// create the module and name it votingApp
var votingApp = angular.module('votingApp', ['ui.bootstrap']);

// configure our routes
votingApp.config(function($routeProvider) {
	$routeProvider

		// route for the login page
		.when('/', {
			templateUrl : 'pages/login.html',
			controller  : 'loginController'
		})
		//routeto the chili page
		.when('/chili', {
			templateUrl : 'pages/chili.html',
			controller  : 'voteController'
		})
		// route for the vote page
		.when('/vote', {
			templateUrl : 'pages/vote.html',
			controller  : 'voteController'
		});
});