describe('AirFlow Client Side', function() {

beforeEach(module('AirFlowApp'));
	describe('Property based testing', function() {
		beforeEach(module('js/directives/simulation.html'));
		beforeEach(inject(function($rootScope, $compile, $httpBackend){
			http = $httpBackend;

			http.whenGET("/json/defaultCase.json").respond({
				data: {
					prop: "val",
				}
		    });

			scope = $rootScope.$new();
			var sim = '<simulation></simulation>';
	        sim = $compile(sim)(scope);

	        scope.$digest();
	        scope.getDefaults = sinon.stub();
		}));
		describe('createParticles', function() {		
			beforeEach(function () {
				scope.particles = [];
				scope.availableParticles = [];
			});
			it('createParticles should generate particles for all positive integers', function() {	
				this.timeout(5000);				
				qc.forAll(qc.int.between(-20,200), function(num) {
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(num);

					//Have to manually add assertion, using expect assertion would only check the first instance of createParticle
					if (num <= 0) { 
						if (scope.particles.length !== 0) {							
							throw "Create particles failed for " + num;
						} 
						if (scope.availableParticles.length !== 0) {	
							throw "Create particles failed for " + num;
						} 
					} else {
						if (scope.particles.length !== num) {							
							throw "Create particles failed for " + num;
						} 
						if (scope.availableParticles.length !== num) {							
							throw "Create particles failed for " + num;
						} 
					}
				});
			});
		});
	});
});