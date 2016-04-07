describe('AirFlow Client Side', function() {

beforeEach(module('AirFlowApp'));

	describe('Main Controller', function() {	

		var scope, MainController;

		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			MainController = $controller('MainController', {$scope: scope});
		}));

		describe('Testing scope value', function() {
			it('unitTestValue should be 554 ', function() {
			 	expect(scope.unitTestValue).to.equal(554);
			});
		});
	});
});
