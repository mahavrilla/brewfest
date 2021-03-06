// create the controller and inject Angular's $scope
votingApp.controller('loginController', function($scope, $http, $location, loginService, dataService) {

	// create a message to display in our view
	$scope.message = 'Enter ID!';
	$scope.entryCode = ''; 
	$scope.showLoginError = false;
	$scope.loggedIn = false;

	//check to see if the code was put in the URl. 
	$scope.entryCode = ($location.search()).code;
	if($scope.entryCode) {
		$scope.login($scope.entryCode);
	}

	//login
	$scope.login = function( code) {
		dataService.checkVoteCode( code).then( function( result) {
			if(result.length === 1) {
				loginService.updateStatus(true, result[0].id, result[0].Used, result[0].Code);
			    if(loginService.locked) {
	      			$scope.showLoginError = true;
	      			$scope.errorMessage = 'this code has already been submitted, use a different code';
	      		} else {
	      			$scope.loggedIn = true;
	      			localStorage.setItem("brewfestCode", code);
	      			$scope.go('/voting');
	      		}
	      	} else {
	      		$scope.showLoginError = true;
	      		$scope.errorMessage = 'invalid code, please reenter';
	      	}
		});
	}

	$scope.logout = function() {
		loginService.logout();
		localStorage.removeItem('brewfestCode');
		$scope.go('/');
	}

	$scope.go = function ( path ) {
  		$location.path( path );
	};

	if($location.url() != '/admin') {
		$scope.local = localStorage.getItem("brewfestCode");
	    if($scope.local) {
	    	$scope.entryCode = $scope.local;
	    	$scope.login( $scope.entryCode);
	    }
	}

});