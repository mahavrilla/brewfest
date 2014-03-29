// script.js

	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', []);

	scotchApp.service('loginService', function(){
    	var isLoggedIn = false;
    	var codeId = 'test';
    	var codeNumber = '';
    	var locked = false;

    	this.updateStatus = function(status, codeId, locked, code) {
    		this.isLoggedIn = status; 
    		this.codeId = codeId; 
    		this.codeNumber = code;
    		this.locked = locked; 
    	};

    	this.getStatus = function( ) {
    		return this.isLoggedIn;
    	}
	});

	scotchApp.service('votingService', function(){
		var updatedVotes = [];
		var beerItems = [];

		this.addVotes = function(votes) {
			this.updatedVotes = votes;
		}

		this.addBeers = function(beers) {
			this.beerItems = beers;
		}

    	this.getSize = function() {
    		return this.updatedVotes.length;
    	}

    	this.updateRatings = function() {
    		for( var x = 0; x < this.beerItems.length; x++) {
    			for( var i = 0; i < this.updatedVotes.length; i++) {
    				if(this.updatedVotes[i].beerId == this.beerItems[x].id) {
    					this.beerItems[x].rating = this.updatedVotes[i].rating;
    				}
    			}
    		}
    	}

	});

	// configure our routes
	scotchApp.config(function($routeProvider) {
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

	// create the controller and inject Angular's $scope
	scotchApp.controller('loginController', function($scope, $http, $location, loginService) {

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
		      			$scope.go('/vote');
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

	scotchApp.controller('voteController', function($scope, $http, $location, loginService, votingService) {
		$scope.beerItems = [];
		$scope.updatedItems = [];
        $scope.rating = '1';

        if(!loginService.isLoggedIn) {
        	$location.path( '/' );
        }

        $http.get('/beers') 
      		.error(function(err) { 
      			return alert(err.message || "an error occurred");
      		}).then(function(results) {
      			$scope.loaded = true;
      			$scope.beerItems = results.data;
      			votingService.addBeers( results.data);
    		});

        $http.get('/votes', { 
	    	params : {
	      	codeId: loginService.codeId
	      }
	 	})
	 	.error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    })
	    .then( function(results) {
	 		$scope.updatedItems = results.data;
	 		votingService.addVotes( results.data);
	 		$scope.updateRatings();
	    });

	    $scope.updateRatings = function() {
	    	votingService.updateRatings();
	    };

	   	$scope.createNewVote = function(beer,rating) {
	    	//check to see if that record exists yet. 
			$http.post('/votes', {
		      codeId: loginService.codeId,
		      code: loginService.codeNumber,
		      beerId: beer.id,
		      rating: rating
		    }).success( function(beer) {
		    	//Change field to Update. 
		    }).error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    });
		}

		$scope.updateExistingVote = function(beer,rating, voteId) {
	    	//check to see if that record exists yet. 
			$http.put('/votes', {
			  id: voteId,
		      rating: rating
		    }).success( function(beer) {
		    	//Change field to Update. 
		    }).error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    });
		}

		$scope.saveVote = function(beer, rating) {
			//check to see if that record exists yet. 
			$http.get('/votes', { 
		    	params : {
		      	codeId: loginService.codeId,
		      	beerId: beer.id
	     		}
	 		}).success(function(result) {
	 			if(result.length == 0) {
	 				//createNew
	 				$scope.createNewVote(beer, rating);
	 			} else {
	 				//Update
	 				$scope.updateExistingVote(beer, rating, result[0].id);
	 			}
	 		});
		};

		$scope.finalizeVote = function() {
			  $http.put('/codes', {
		      id: loginService.codeId,
		      Used: true
		    }).success( function(beer) {

		    	//Change field to Update. 
		    }).error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    });
		};
	});