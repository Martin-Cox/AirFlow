var defaultsService = angular.module('defaultsService', []);
defaultsService.service('getCaseDefaults', function($http) {
	var x;
	$http({
		method: 'GET',
		url: '/json/defaultCase.json'
	}).then (function success(response) {
		//Success
		//TODO: Return case data
		var x = 1;
	}, function error(response) {
		//TODO: Create error message here 
        console.log("failure");
	});
});