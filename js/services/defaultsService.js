app.service('defaultsService', function($http) {
	this.getCaseDefaults = function() {
			$http({
				method: 'GET',
				url: '/json/defaultCase.json'
			}).then (function success(response) {
				//Success
				return response.data;
			}, function error(response) {
				//TODO: Create error message here 
		        console.log("failure");
			});
	}
});