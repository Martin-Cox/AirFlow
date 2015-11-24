app.service('defaultsService', function($http) {
	this.getCaseDefaults = function() {
			return $http({
				method: 'GET',
				url: '/json/defaultCase.json'
			}).then (function success(response) {
				//Success
				return response.data;
			}, function error(response) {
				//TODO: Return error message 
		        console.log("failure");
			});
	}
});