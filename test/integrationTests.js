describe('AirFlow Client Side', function() {

beforeEach(module('AirFlowApp'));
	describe('Main Controller/Simulation Directive Integration tests', function() {
		var scope, MainController, http;

		var projectDefault = 
			{
			  "projectName": "New Project",
			  "author": "Anonymous",
			  "version": 1
			}  

		var testFan = 
			{
				"properties": {
					"mode": "intake",
					"size": 120,
					"maxRPM": 1000,
					"percentageRPM": 100,
					"position": 0,
					"active": true,
					"dateCreated": "29/03/2016",
					"dateModified": "29/03/2016",
					"isValidPos": true,
					"forceVector": {
						"x": 0,
						"y": 0,
						"z": 0
					}
				},
				"dimensions": {
					"width": 120,
					"height": 120,
					"depth": 40
				},
				"x": 0,
				"y": 100,
				"z": -248
			}

		beforeEach(module('js/directives/simulation.html'));
		beforeEach(inject(function($controller, $rootScope, $compile, $httpBackend){
			http = $httpBackend;

			http.whenGET("/json/defaultCase.json").respond({
				data: {
					prop: "val",
				}
		    });

			scope = $rootScope.$new();
			MainController = $controller('MainController', {$scope: scope});
			var sim = '<simulation></simulation>';
	        sim = $compile(sim)(scope);

	        scope.$digest();
	        scope.getDefaults = sinon.stub();
		}));
		describe('fan details change watcher', function() {
			var testDate = "01/01/2016";
			beforeEach(inject(function(){				
				//Stub out any method calls, we don't care about them in the context of this test			
				getDateStub = sinon.stub(scope, 'getCurrentDate', function getCurrentDateCustom() {
					return testDate;
				});

				scope.resizeFan = sinon.stub();
			}));
			describe('fan and project dates', function() {
				beforeEach(inject(function(){				
					scope.editFan = testFan;
					scope.fans.push(testFan);
					scope.fanPropertiesChange();
				}));
				it('should update project modified date', function() {					
					expect(scope.projectDetails.dateModified).to.equal(testDate);
				});
				it('should update fan modified date', function() {
					expect(scope.editFan.properties.dateModified).to.equal(testDate);
				});
				it('should update fan lists', function() {
					expect(scope.intakeFans.length).to.equal(1);
				});
			});
			describe('different fan configurations', function() {
				beforeEach(inject(function(){				
					scope.editFan = 
						{
							"properties": {
								"mode": "intake",
								"size": 120,
								"maxRPM": 1000,
								"percentageRPM": 100,
								"position": 0,
								"active": true,
								"dateCreated": "29/03/2016",
								"dateModified": "29/03/2016",
								"isValidPos": true,
								"forceVector": {
									"x": 0,
									"y": 0,
									"z": 0
								}
							},
							"dimensions": {
								"width": 120,
								"height": 120,
								"depth": 40
							},
							"x": 0,
							"y": 100,
							"z": -248
						}
					scope.fans.push(scope.editFan);
				}));
				describe('using default fan', function() {
					it('forceVector should be (0, 0, 70000) for an active fan', function() {		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(70000);
					});
					it('forceVector should be (0, 0, 0) for an inactive fan', function() {	
						scope.editFan.properties.active = false;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
				});
				describe('different fan sizes (maxRPM 1000, 100% RPM)', function() {	
					it('forceVector should be (0, 0, 50000) for a small fan (80mm)', function() {	
						scope.editFan.properties.size = 80;	
						scope.fanPropertiesChange();
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(50000);
					});
					it('forceVector should be (0, 0, 70000) for a medium sized fan (120mm)', function() {	
						scope.editFan.properties.size = 120;		
						scope.fanPropertiesChange();
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(70000);
					});
					it('forceVector should be (0, 0, 80000) for a large fan (140mm)', function() {	
						scope.editFan.properties.size = 140;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(80000);
					});
				});
				describe('different RPM (fan size 120mm, 100% RPM)', function() {		
					it('forceVector should be (0, 0, 60010) for RPM 1', function() {
						scope.editFan.properties.maxRPM = 1;			
						scope.fanPropertiesChange();
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(60010);
					});
					it('forceVector should be (0, 0, 75000) for RPM 1500', function() {
						scope.editFan.properties.maxRPM = 1500;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(75000);
					});
					it('forceVector should be (0, 0, 89990) for RPM 2999', function() {	
						scope.editFan.properties.maxRPM = 2999;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(89990);
					});
					it('forceVector should be (0, 0, 90000) for RPM 3000', function() {
						scope.editFan.properties.maxRPM = 3000;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(90000);
					});
				});
				describe('different RPM% (fan size 120mm, maxRPM 1000)', function() {		
					it('forceVector should be (0, 0, 0) for 0% RPM', function() {
						scope.editFan.properties.percentageRPM = 0;			
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('forceVector should be (0, 0, 700) for 1% RPM', function() {
						scope.editFan.properties.percentageRPM = 1;		
						scope.fanPropertiesChange();		
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(700);
					});
					it('forceVector should be (0, 0, 35000) for 50% RPM', function() {	
						scope.editFan.properties.percentageRPM = 50;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(35000);
					});
					it('forceVector should be (0, 0, 69300) for 99% RPM', function() {
						scope.editFan.properties.percentageRPM = 99;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(69300);
					});
					it('forceVector should be (0, 0, 70000) for 100% RPM', function() {
						scope.editFan.properties.percentageRPM = 100;		
						scope.fanPropertiesChange();							
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(70000);
					});
				});
				describe('intake fan in different fan positions', function() {		
					it('front side should be (0, 0, 70000)', function() {
						scope.editFan.properties.position = 0;			
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(70000);
					});
					it('back side should be (0, 0, -70000)', function() {
						scope.editFan.properties.position = 1;		
						scope.fanPropertiesChange();		
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(-70000);
					});
					it('top side should be (0, -70000, 0)', function() {	
						scope.editFan.properties.position = 2;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(-70000);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('bottom side should be (0, 70000, 0)', function() {
						scope.editFan.properties.position = 3;		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(70000);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('visible side should be (70000, 0, 0)', function() {
						scope.editFan.properties.position = 4;		
						scope.fanPropertiesChange();							
						expect(scope.editFan.properties.forceVector.x).to.equal(70000);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('invisible side should be (-70000, 0, 0)', function() {
						scope.editFan.properties.position = 5;		
						scope.fanPropertiesChange();							
						expect(scope.editFan.properties.forceVector.x).to.equal(-70000);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
				});
				describe('exhaust fan in different fan positions', function() {		
					it('front side should be (0, 0, -70000)', function() {
						scope.editFan.properties.position = 0;			
						scope.editFan.properties.mode = "exhaust";	
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(-70000);
					});
					it('back side should be (0, 0, 70000)', function() {
						scope.editFan.properties.position = 1;		
						scope.editFan.properties.mode = "exhaust";	
						scope.fanPropertiesChange();		
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(70000);
					});
					it('top side should be (0, 70000, 0)', function() {	
						scope.editFan.properties.position = 2;	
						scope.editFan.properties.mode = "exhaust";		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(70000);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('bottom side should be (0, -70000, 0)', function() {
						scope.editFan.properties.position = 3;	
						scope.editFan.properties.mode = "exhaust";		
						scope.fanPropertiesChange();	
						expect(scope.editFan.properties.forceVector.x).to.equal(0);
						expect(scope.editFan.properties.forceVector.y).to.equal(-70000);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('visible side should be (-70000, 0, 0)', function() {
						scope.editFan.properties.position = 4;	
						scope.editFan.properties.mode = "exhaust";		
						scope.fanPropertiesChange();							
						expect(scope.editFan.properties.forceVector.x).to.equal(-70000);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
					it('invisible side should be (70000, 0, 0)', function() {
						scope.editFan.properties.position = 5;
						scope.editFan.properties.mode = "exhaust";			
						scope.fanPropertiesChange();							
						expect(scope.editFan.properties.forceVector.x).to.equal(70000);
						expect(scope.editFan.properties.forceVector.y).to.equal(0);
						expect(scope.editFan.properties.forceVector.z).to.equal(0);
					});
				});
			});
		});
	});
});	
