// create the controller and inject Angular's $scope
votingApp.controller('loginController', function($scope, $http, $location, loginService) {

	// create a message to display in our view
	$scope.message = 'Enter ID!';
	$scope.entryCode = ''; 
	$scope.showLoginError = false;

	//login
	$scope.login = function(code) {
	    $http.get('/codes', { 
	      params : {
	      	Code: code
	      }
	    }).success( function(result) {
	      	if(result.length === 1) {
	      		loginService.updateStatus(true, result[0].id, result[0].Used, result[0].Code);
			    if(loginService.locked) {
	      			$scope.showLoginError = true;
	      			$scope.errorMessage = 'this code has already been submitted, use a different code';
	      		} else {
	      			$scope.myName = loginService.isLoggedIn;
	      			$scope.go('/beer');
	      		}
	      	} else {
	      		$scope.showLoginError = true;
	      		$scope.errorMessage = 'invalid code, please reenter';
	      	}
	    }).error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    });
		};

		$scope.go = function ( path ) {
	  $location.path( path );
	};

    $scope.entryCode = ($location.search()).code;
	if($scope.entryCode) {
		$scope.login($scope.entryCode);
	}
});