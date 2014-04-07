votingApp.controller('votingController', function($scope, $http, $location, $timeout, votingService, loginService, dataService) {
	$scope.beerItems = [];
	$scope.chiliItems = []; 
	$scope.votes = [];
	$scope.alerts = [];
	$scope.showBeer = true;
	$scope.showChili = false;
  $scope.searchItems = '';
  $scope.currentCode = loginService.codeNumber;

    toastr.options = {
                      "closeButton": false,
                      "debug": false,
                      "positionClass": "toast-top-center",
                      "onclick": null,
                      "showDuration": "300",
                      "hideDuration": "1000",
                      "timeOut": "2000",
                      "extendedTimeOut": "1000",
                      "showEasing": "swing",
                      "hideEasing": "linear",
                      "showMethod": "fadeIn",
                      "hideMethod": "fadeOut"
                    }

    if(!loginService.isLoggedIn) {
    	$location.path( '/' );
    }

    dataService.getBeers().then( function( d) {
    	$scope.beerItems = d;

    	//level 2
    	dataService.getVotes( loginService.codeNumber).then(function( votes) {
    		$scope.votes = votes;
    		$scope.beerItems = votingService.updateNewRatings($scope.beerItems, votes);
   		 });
    });

    dataService.getChili().then(function(d) {
    	$scope.chiliItems = d;

    	//level 2
    	dataService.getVotes( loginService.codeNumber).then(function( votes) {
    		$scope.votes = votes;
    		$scope.chiliItems = votingService.updateNewRatings($scope.chiliItems, votes);
   		 });

    });

    $scope.clearSearch = function() {
      $scope.searchItems = '';
    }

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
    	dataService.checkExistingVote(loginService.codeId, item.id, isBeer ).then(function(d) {
    		$scope.existingVotes = d;

    		if( $scope.existingVotes.length == 0) {
    			// create new voting record
	    		dataService.createNewVote(loginService.codeId, loginService.codeNumber, rating, item.id, isBeer ).then(function(d) {
	    			
                    
                    toastr.success(item.name + ' was updated to ' + rating, 'success');
                    //$scope.addAlert(item.name, rating);
	    		});
    		} else {
    			// update existing vote: 
	    		dataService.updateExistingVote($scope.existingVotes[0].id, rating, isBeer).then(function( d) {
                    toastr.success(item.name + ' was updated to ' + rating, 'success');
	    			//$scope.addAlert(item.name, rating);
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
		dataService.finalize().then( function( d) {
      if(d.length == 0) {
        toastr.error('Please try to submit your votes again');
      } else {
         toastr.success('Votes Submitted, your code is now locked: ' + d.Code , 'success');
         loginService.logout();
         $location.path( '/' );
      } 
    });
	};

  $scope.checkSuccess = function( rating) {
    return rating > 0;
  }

});