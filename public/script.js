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
		.when('/admin', {
			templateUrl : 'pages/admin.html',
			controller  : 'adminController'
		})
		//routeto the chili page
		.when('/chili', {
			templateUrl : 'pages/chili.html',
			controller  : 'chiliController'
		})
		//routeto the chili page
		.when('/voting', {
			templateUrl : 'pages/voting.html',
			controller  : 'votingController'
		})
		// route for the vote page
		.when('/beer', {
			templateUrl : 'pages/beer.html',
			controller  : 'beerController'
		});
});