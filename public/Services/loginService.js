votingApp.service('loginService', function(){
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

	this.logout = function() {
		this.isLoggedIn = false; 
		this.codeId = ''; 
		this.codeNumber = '';
		this.locked = false; 
	}

	this.getStatus = function( ) {
		return this.isLoggedIn;
	}
});