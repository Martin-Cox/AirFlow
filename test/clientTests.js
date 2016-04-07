describe('AirFlow Client Side', function() {

beforeEach(module('AirFlowApp'));

	describe('Defaults Service', function() {	
		var http;
		var defaultsService;

		//beforeEach(module('defaultsService'));

		beforeEach(inject(function($httpBackend, _defaultsService_){
			http = $httpBackend;
			//defaultsService = $service('defaultsService', {$http: http});
			defaultsService = _defaultsService_;
		}));

		describe('Case Defaults', function() {
			it('should return JSON data', function() {
				http.whenGET("/json/defaultCase.json").respond({
					data: {
						simpleProperty: "simpleValue",
						complexProperty: {
							deepProperty1: "deepValue1",
							deepProperty2: "deepValue2",
						}
					}
			    });
			    defaultsService.getCaseDefaults().then(function(response) {
			    	expect(response.data).to.exist;
			     	expect(response.data).to.have.property("simpleProperty").and.equal("simpleValue");
			     	expect(response.data).to.have.property("complexProperty");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty1").and.equal("deepValue1");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty2").and.equal("deepValue2");
			    });
			    http.flush();
			});
		});
	});

	describe('Simulation Directive', function() {	

	});

	describe('Main Controller', function() {	

		var scope, MainController;

		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			MainController = $controller('MainController', {$scope: scope});
			//scope.newProject();
		}));

		describe('Testing scope value', function() {
			it('unitTestValue should be 554 ', function() {
				//console.log(scope);
			 	expect(scope.unitTestValue).to.equal(554);
			});
		});
	});
});
