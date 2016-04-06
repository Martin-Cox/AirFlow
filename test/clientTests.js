before(function() {
	module('AirFlowApp');
});

describe('AirFlow Client Side', function(){
	describe('#indexOf()', function(){
		it('should return -1 when the value is not present', function(){
			assert.equal(-1, [1,2,3].indexOf(5));
		 	assert.equal(-1, [1,2,3].indexOf(0));
		});
	})
	describe('equality', function(){
		it('1 should equal 1', function(){
			expect(1).to.equal(1);
		});
		it('1 + 2 should equal 3', function(){
			expect(1 + 2).to.equal(3);
		});
	})
	describe('failure', function(){
		it('should fail', function(){
		 	expect(1).to.equal(2);
		});
	})
	describe('test scope', function() {
		it('edit fan should equal null', inject(function($controller){
			var myController = $controller('MainController');
		 	expect(myController.$scope.editFan).to.equal(null);
		}));
	})
})
