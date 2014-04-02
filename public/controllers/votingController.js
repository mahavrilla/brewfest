votingApp.controller('votingController', function($scope, $http, $location, $timeout, votingService, loginService, dataService) {
	$scope.beerItems = [];
	$scope.chiliItems = []; 
	$scope.votes = [];
	$scope.alerts = [];
	$scope.showBeer = true;
	$scope.showChili = false;

    if(!loginService.isLoggedIn) {
    	$location.path( '/' );
    }
    
    dataService.getBeers().then(function(d) {
    	$scope.beerItems = d;

    	//level 2
    	dataService.getVotes().then(function( votes) {
    		$scope.votes = votes;
    		$scope.beerItems = votingService.updateNewRatings($scope.beerItems, votes);
   		 });
    });

    dataService.getChili().then(function(d) {
    	$scope.chiliItems = d;

    	//level 2
    	dataService.getVotes().then(function( votes) {
    		$scope.votes = votes;
    		$scope.chiliItems = votingService.updateNewRatings($scope.chiliItems, votes);
   		 });

    });

    $scope.showChilis = function() {
    	$scope.showBeer = false;
		$scope.showChili = true;
    }

    $scope.showBeers = function() {
    	$scope.showBeer = true;
		$scope.showChili = false;
    }

    $scope.saveVote = function(item, rating, isBeer) {
    	$scope.existingVotes = [];
    	//check to see if that record exists yet. 
    	dataService.checkExistingVote(loginService.codeId, item.id, true ).then(function(d) {
    		$scope.existingVotes = d;

    		if( $scope.existingVotes.length == 0) {
    			// create new voting record
	    		dataService.createNewVote(loginService.codeId, loginService.codeNumber, rating, item.id, isBeer ).then(function(d) {
	    			$scope.addAlert(item.name, rating);
	    		});
    		} else {
    			// update existing vote: 
	    		dataService.updateExistingVote($scope.existingVotes[0].id, rating, isBeer).then(function( d) {
	    			$scope.addAlert(item.name, rating);
    			});
    		}
    	});
    }

	$scope.addAlert = function(name, rating) {
    	$scope.alerts.push( { type: 'success', msg: name + ' was updated to ' + rating } );
    	$timeout(function(){
        	$scope.closeAlert(0);
      	}, 2000);
 	};

 	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
  	};

	$scope.finalizeVote = function() {
		dataService.finalize();
	};
});