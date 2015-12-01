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
	this.getFanDefaults = function() {
			return $http({
				method: 'GET',
				url: '/json/defaultFans.json'
			}).then (function success(response) {
				//Success
				return response.data;
			}, function error(response) {
				//TODO: Return error message 
		        console.log("failure");
			});
	}
	this.getProjectDetailsDefaults = function() {
			return $http({
				method: 'GET',
				url: '/json/defaultProjectDetails.json'
			}).then (function success(response) {
				//Success
				return response.data;
			}, function error(response) {
				//TODO: Return error message 
		        console.log("failure");
			});
	}
	this.getNewFanDefaults = function() {
			return $http({
				method: 'GET',
				url: '/json/defaultNewFanDetails.json'
			}).then (function success(response) {
				//Success
				return response.data;
			}, function error(response) {
				//TODO: Return error message 
		        console.log("failure");
			});
	}
});