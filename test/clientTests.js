beforeEach(module('AirFlowApp'));

var $MainController;

describe('AirFlow Client Side', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function(){
			assert.equal(-1, [1,2,3].indexOf(5));
		 	assert.equal(-1, [1,2,3].indexOf(0));
		});
	})
	describe('equality', function() {
		it('1 should equal 1', function() {
			expect(1).to.equal(1);
		});
		it('1 + 2 should equal 3', function(){
			expect(1 + 2).to.equal(3);
		});
	})
	describe('Main Controller', function() {
		beforeEach(inject(function(_$controller_, _$rootScope_){
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$controller = _$controller_;
			$rootScope = _$rootScope_;
		}));
		describe('Testing scope value', function() {
			it('unitTestValue should be 554 ', function() {
				var scope = $rootScope.$new();
				var myController = $controller('MainController', {$scope: scope});
				console.log
			 	expect(myController.unitTestValue).to.equal(554);
			});
		});
	});
});
