describe('AirFlow Client Side', function() {

beforeEach(module('AirFlowApp'));
	describe('Defaults Service', function() {	
		var http;
		var defaultsService;
		beforeEach(inject(function($httpBackend, _defaultsService_){
			http = $httpBackend;
			defaultsService = _defaultsService_;
		}));
		describe('getCaseDefaults', function() {
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
		describe('getFanDefaults', function() {
			it('should return JSON data', function() {
				http.whenGET("/json/defaultFans.json").respond({
					data: {
						simpleProperty: "simpleValue",
						complexProperty: {
							deepProperty1: "deepValue1",
							deepProperty2: "deepValue2",
						}
					}
			    });
			    defaultsService.getFanDefaults().then(function(response) {
			    	expect(response.data).to.exist;
			     	expect(response.data).to.have.property("simpleProperty").and.equal("simpleValue");
			     	expect(response.data).to.have.property("complexProperty");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty1").and.equal("deepValue1");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty2").and.equal("deepValue2");
			    });
			    http.flush();
			});
		});
		describe('getProjectDetailsDefaults', function() {
			it('should return JSON data', function() {
				http.whenGET("/json/defaultProjectDetails.json").respond({
					data: {
						simpleProperty: "simpleValue",
						complexProperty: {
							deepProperty1: "deepValue1",
							deepProperty2: "deepValue2",
						}
					}
			    });
			    defaultsService.getProjectDetailsDefaults().then(function(response) {
			    	expect(response.data).to.exist;
			     	expect(response.data).to.have.property("simpleProperty").and.equal("simpleValue");
			     	expect(response.data).to.have.property("complexProperty");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty1").and.equal("deepValue1");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty2").and.equal("deepValue2");
			    });
			    http.flush();
			});
		});		
		describe('getNewFanDefaults', function() {
			it('should return JSON data', function() {
				http.whenGET("/json/defaultNewFanDetails.json").respond({
					data: {
						simpleProperty: "simpleValue",
						complexProperty: {
							deepProperty1: "deepValue1",
							deepProperty2: "deepValue2",
						}
					}
			    });
			    defaultsService.getNewFanDefaults().then(function(response) {
			    	expect(response.data).to.exist;
			     	expect(response.data).to.have.property("simpleProperty").and.equal("simpleValue");
			     	expect(response.data).to.have.property("complexProperty");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty1").and.equal("deepValue1");
			     	expect(response.data).to.have.deep.property("complexProperty.deepProperty2").and.equal("deepValue2");
			    });
			    http.flush();
			});
		});
		describe('getStatsAnalysis', function() {
			it('should return JSON data', function() {
				http.whenGET("/json/statsAnalysis.json").respond({
					data: {
						simpleProperty: "simpleValue",
						complexProperty: {
							deepProperty1: "deepValue1",
							deepProperty2: "deepValue2",
						}
					}
			    });
			    defaultsService.getStatsAnalysis().then(function(response) {
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
	describe('Main Controller', function() {
		var scope, MainController, http;

		var projectDefault = 
			{
			  "projectName": "New Project",
			  "author": "Anonymous",
			  "version": 1
			}  

		var caseDefault = 
			{
			  "materials": {
			    "caseMaterial": {
			      "color": "0x5F6E7D",
			      "friction": 0.3,
			      "restitution": 0.1
			    },
			    "transparentMaterial": {
			      "color": "0x5F6E7D",
			      "friction": 0.3,
			      "restitution": 0.1,
			      "transparent": true,
			      "opacity": 0.2,
			      "side": "THREE.DoubleSide"
			    },
			    "componentMaterial": {
			      "color": "0xD5D3D0",
			      "friction": 0.3,
			      "restitution": 0.1
			    }
			  },
			  "dimensions": {
			    "width": 210,
			    "height": 486,
			    "depth": 495,
			    "thickness": 4,
			    "fanHoleSize": 120
			  }
			}

		var fansDefault = 
			{
			  "fanOne" : {
			    "fanObject": {
			      "material": {
			        "side": "THREE.DoubleSide"
			      },
			      "dimensions": {
			        "width": 120,
			        "height": 120,
			        "depth": 40
			      }
			    },
			    "fanAOEObject": {
			      "material": {
			        "transparent": true,
			        "opacity": 0,
			        "side": "THREE.DoubleSide"
			      },
			      "dimensions": {
			        "radiusTop": 60,
			        "radiusBottom": 60,
			        "radiusSegments": 25,
			        "heightSegments": 25
			      }
			    },
			    "properties": {
			      "size": 120,
			      "maxRPM": 1800,
			      "percentageRPM": 80,
			      "mode": "intake",
			      "position": 0,
			      "forceVector" : {
			        "x": 0,
			        "y": 5000,
			        "z": 30000
			      },
			      "active": true
			    },
			    "position" : {
			      "x": 0,
			      "y": 100,
			      "z": -248
			    }
			  },
			  "colors" : {
			    "normal": "0x003566",
			    "inactive": "0x99AEC1",
			    "highlight": "0x4D82B3",
			    "validEdit": "0x519C52",
			    "invalidEdit": "0xCF5157",
			    "wireframe": "0x90DAFF"
			  }
			}

		var newFanDefault =
			{
			  "fanObject": {
			    "material": {
			      "color": "0x333333",
			      "side": "THREE.DoubleSide"
			    },
			    "dimensions": {
			      "width": 120,
			      "height": 120,
			      "depth": 40
			    }
			  },
			  "fanAOEObject": {
			    "material": {
			      "color": "0x333333",
			      "transparent": true,
			      "opacity": 0,
			      "side": "THREE.DoubleSide"
			    },
			    "dimensions": {
			      "radiusTop": 60,
			      "radiusBottom": 60,
			      "radiusSegments": 25,
			      "heightSegments": 25
			    }
			  },
			  "properties": {
			    "size": 120,
			    "maxRPM": 1000,
			    "percentageRPM": 100,
			    "mode": "intake"
			  }
			}

		var stats = 
			{
			  "overall": {
			    "result": {
			      "good": "Good setup",
			      "average": "Average setup",
			      "bad": "Bad setup"
			    },
			    "numFans": {
			      "tooMany": {
			        "val" : "Too many fans",
			        "mod": 1
			      },
			      "tooFew": {
			        "val" : "Too few fans",
			        "mod": 1
			      },
			      "goodAmount": {
			        "val" : "Good amount of fans",
			        "mod": 2
			      }
			    },
			    "particleSuccessRatio": {
			      "good": {
			        "val" : "Nearly all particles are successful",
			        "mod": 3
			      },
			      "average": {
			        "val" : "Most particles are successful",
			        "mod": 1
			      },
			      "bad": {
			        "val" : "Most particles are culled",
			        "mod": 0
			      }
			    }
			  },
			  "fanRatio": {
			    "equal": {
			      "val": "Equal number of intake and exhaust fans",
			      "desc": "You have an equal number of intake and exhaust fans. This setup strikes a good balance between cooling and dust buildup. Be sure to install filters on the intake fans to further reduce dust buildup."
			    },
			    "moreIntake": {
			      "val": "More intake fans than exhaust fans",
			      "desc": "You have more intake fans than exhaust fans. The intake fans will fight against each other and you could experience rapid dust buildup. This is because the intake fans will move the air from outside your case to the inside resulting in positive air pressure. To compensate for the positive air pressure created by the intake fans, air (and dust) will be blown out through the small holes and cracks in your computer case. You will need to install air filters to the intake fans to prevent large amounts of dust accumulating."
			    },
			    "moreExhaust": {
			      "val": "More exhaust fans than intake fans",
			      "desc": "You have more exhaust fans than intake fans. The exhaust fans will fight against each other and you could experience rapid dust buildup. This is because the exhaust fans will move the air from inside your case to the outside resulting in negative air pressure. To compensate for the negative air pressure created by the exhaust fans, air (and dust) will be drawn in through the small holes and cracks in your computer case."
			    }
			  },
			  "particleSuccessRatio": {
			    "good": {
			      "val": "Nearly all particles are successful",
			      "desc": "This setup ensures good airflow in your case and has little to no pockets of air buildup."
			    },
			    "average": {
			      "val": "Most particles are successful",
			      "desc": "This setup ensures average airflow in your case but the placement of fans could be improved to reduce pockets of air buildup."
			    },
			    "bad": {
			      "val": "Most particles are culled",
			      "desc": "This setup performs poorly as few particles are successful. Consider adding more fans, changing the placement of fans, or changing the ratio of intake:exhaust fans to eliminate pockets of air buildup."
			    }
			  }
			}

			var sampleProject = 
				{
					"projectDetails": {
						"projectName": "Test Project",
						"author": "Joe Bloggs",
						"version": 2,
						"dateCreated": "29/03/2016",
						"dateModified": "29/03/2016"
					},
					"stats": {
						"particleRatio": 100,
						"numFans": 2,
						"numIntakeFans": 1,
						"numExhaustFans": 1,
						"particleSuccessPercentage": "40.00%",
						"particleFailurePercentage": "20.00%",
						"particleLivePercentage": "40.00%",
						"particleSuccessRatioVal": "Nearly all particles are successful",
						"particleSuccessRatioMod": 3,
						"spawnedParticles": 50,
						"activeParticles": 20,
						"culledParticles": 10,
						"removedParticles": 20
					},
					"fans": {
						"0": {
							"properties": {
								"mode": "intake",
								"size": 120,
								"maxRPM": 1800,
								"percentageRPM": 80,
								"position": 0,
								"dateCreated": "29/03/2016",
								"dateModified": "29/03/2016",
								"isValidPos": true,
								"forceVector": {
									"x": 0,
									"y": 0,
									"z": 62400
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
						},
						"1": {
							"properties": {
								"mode": "exhaust",
								"size": 120,
								"maxRPM": 1000,
								"percentageRPM": 100,
								"position": 1,
								"dateCreated": "29/03/2016",
								"dateModified": "29/03/2016",
								"isValidPos": true,
								"forceVector": {
									"x": 0,
									"y": 0,
									"z": 70000
								}
							},
							"dimensions": {
								"width": 120,
								"height": 120,
								"depth": 40
							},
							"x": 0,
							"y": 420,
							"z": 248
						}
					}
				}

				var testFan = 
					{
						"properties": {
							"mode": "intake",
							"size": 120,
							"maxRPM": 1800,
							"percentageRPM": 80,
							"position": 0,
							"dateCreated": "29/03/2016",
							"dateModified": "29/03/2016",
							"isValidPos": true,
							"forceVector": {
								"x": 0,
								"y": 0,
								"z": 62400
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
		describe('newProject() should reset values', function() {
			beforeEach(inject(function(){
				scope.defaultProjectDetails = projectDefault;
				scope.defaultCase = caseDefault;
				scope.fanColors = fansDefault.colors;
				scope.defaultFans = fansDefault;
				scope.defaultNewFanAOE = fansDefault.fanOne.fanAOEObject;
				scope.defaultNewFan = newFanDefault;
				scope.statsAnalysis = stats;
				scope.$digest();

				//Stub out any method calls, we don't care about them in the context of this test
				scope.emptyScene = sinon.stub();
				scope.init = sinon.stub();
				scope.animate = sinon.stub();
				scope.newProject();
			}));
			it('projectDetails should be default values', function() {
				expect(scope.projectDetails.projectName).to.equal(projectDefault.projectName);
			 	expect(scope.projectDetails.author).to.equal(projectDefault.author);
			 	expect(scope.projectDetails.version).to.equal(projectDefault.version);
			});
			it('projectDetails date fields should be todays date', function() {
				var currentFormattedDate = scope.getCurrentDate();

				expect(scope.projectDetails.dateCreated).to.equal(currentFormattedDate);
			 	expect(scope.projectDetails.dateModified).to.equal(currentFormattedDate);

			});
			it('scope fan variables should be empty', function() {
				expect(scope.fans).to.be.empty;
				expect(scope.exhaustFans).to.be.empty;
				expect(scope.intakeFans).to.be.empty;
				expect(scope.dragFan).to.be.null;
				expect(scope.editFan).to.be.null;
			});
		});
		describe('drawCharts() should draw charts', function() {
			beforeEach(inject(function(){
				scope.charts.drewCharts = false;
			}));
			it('drewCharts should be true', inject(function($timeout) {

				//Stub out any method calls, we don't care about them in the context of this test
				scope.drawParticleSuccessRatioChart = sinon.stub();
				scope.drawFanRatioChart = sinon.stub();
				scope.drawCharts();

				//Flush timouts for code being tested
				$timeout.flush();

				//Verify there are no pending timouts
				$timeout.verifyNoPendingTasks();

				expect(scope.charts.drewCharts).to.be.true;
			}));
		});
		describe('loadProject should load a project file', function() {
			beforeEach(inject(function(){				

				//Stub out any method calls, we don't care about them in the context of this test			
				loadFanStub = sinon.stub(scope, 'loadFan', function loadFanCustom(fan) {
					//Simple stub for load fan
				    scope.fans.push(fan);
				    if (fan.properties.mode === "intake") {
				    	scope.intakeFans.push(fan);
				    } else if (fan.properties.mode === "exhaust") {
				    	scope.exhaustFans.push(fan);
				    }
				});

				scope.removeFansAndParticles = sinon.stub();

				scope.loadProject(sampleProject);

			}));
			it('project details should load', function() {
				expect(scope.projectDetails.projectName).to.equal(sampleProject.projectDetails.projectName);
				expect(scope.projectDetails.author).to.equal(sampleProject.projectDetails.author);
				expect(scope.projectDetails.version).to.equal(sampleProject.projectDetails.version);
				expect(scope.projectDetails.dateCreated).to.equal(sampleProject.projectDetails.dateCreated);
				expect(scope.projectDetails.dateModified).to.equal(sampleProject.projectDetails.dateModified);
			});
			it('stats should load', function() {
				expect(scope.stats.spawnedParticles).to.equal(sampleProject.stats.spawnedParticles);
				expect(scope.stats.activeParticles).to.equal(sampleProject.stats.activeParticles);
				expect(scope.stats.culledParticles).to.equal(sampleProject.stats.culledParticles);
				expect(scope.stats.removedParticles).to.equal(sampleProject.stats.removedParticles);
				expect(scope.stats.particleSuccessPercentage).to.equal(sampleProject.stats.particleSuccessPercentage);
				expect(scope.stats.particleFailurePercentage).to.equal(sampleProject.stats.particleFailurePercentage);
				expect(scope.stats.particleLivePercentage).to.equal(sampleProject.stats.particleLivePercentage);
				expect(scope.stats.particleSuccessRatioVal).to.equal(sampleProject.stats.particleSuccessRatioVal);
				expect(scope.stats.particleSuccessRatioMod).to.equal(sampleProject.stats.particleSuccessRatioMod);
				expect(scope.stats.numFans).to.equal(sampleProject.stats.numFans);
				expect(scope.stats.numExhaustFans).to.equal(sampleProject.stats.numExhaustFans);
				expect(scope.stats.numIntakeFans).to.equal(sampleProject.stats.numIntakeFans);
			});
			it('stats should load', function() {
				expect(scope.stats.spawnedParticles).to.equal(sampleProject.stats.spawnedParticles);
				expect(scope.stats.activeParticles).to.equal(sampleProject.stats.activeParticles);
				expect(scope.stats.culledParticles).to.equal(sampleProject.stats.culledParticles);
				expect(scope.stats.removedParticles).to.equal(sampleProject.stats.removedParticles);
				expect(scope.stats.particleSuccessPercentage).to.equal(sampleProject.stats.particleSuccessPercentage);
				expect(scope.stats.particleFailurePercentage).to.equal(sampleProject.stats.particleFailurePercentage);
				expect(scope.stats.particleLivePercentage).to.equal(sampleProject.stats.particleLivePercentage);
				expect(scope.stats.particleSuccessRatioVal).to.equal(sampleProject.stats.particleSuccessRatioVal);
				expect(scope.stats.particleSuccessRatioMod).to.equal(sampleProject.stats.particleSuccessRatioMod);
				expect(scope.stats.numFans).to.equal(sampleProject.stats.numFans);
				expect(scope.stats.numExhaustFans).to.equal(sampleProject.stats.numExhaustFans);
				expect(scope.stats.numIntakeFans).to.equal(sampleProject.stats.numIntakeFans);
			});
			it('fans should load', function() {
				expect(scope.fans.length).to.equal(2);
				expect(scope.exhaustFans.length).to.equal(1);
				expect(scope.intakeFans.length).to.equal(1);
			});
		});
		describe('getCurrentDate should return a nicely formatted date', function() {
			it.skip('should return a correct date when day and month are 2 digits long', function() {

			});
			it.skip('should return a correct date when day and month are 1 digit long', function() {
				
			});
			it.skip('should return a date 20 years from now', function() {
				
			});
			it.skip('should work on a leap year', function() {
				
			});
		});
		describe('showing/closing of help box', function() {
			it('should show the help box', function() {
				var stubElement = document.createElement('div');
				sinon.stub(document, 'getElementById').returns(stubElement);

				scope.displayingPopup = false;
				scope.showHelpBox();
				expect(scope.displayingPopup).to.equal(true);
			});
			it('should close the help box', function() {
				scope.displayingPopup = true;
				scope.closeHelpBox();
				expect(scope.displayingPopup).to.equal(false);
			});
		});
		describe('project details change watcher', function() {

			var testDate = "01/01/2016";

			beforeEach(inject(function(){				
				//Stub out any method calls, we don't care about them in the context of this test			
				getDateStub = sinon.stub(scope, 'getCurrentDate', function getCurrentDateCustom() {
					return testDate;
				});
			}));
			it('should update project modified date', function() {
				scope.projectDetailsChange();
				expect(scope.projectDetails.dateModified).to.equal(testDate);
			});
		});
		describe('fan details change watcher', function() {

			var testDate = "01/01/2016";
			var testVector = (0, 0, 50000);

			beforeEach(inject(function(){				
				//Stub out any method calls, we don't care about them in the context of this test			
				getDateStub = sinon.stub(scope, 'getCurrentDate', function getCurrentDateCustom() {
					return testDate;
				});
				calcForceStub = sinon.stub(scope, 'calculateForceVector', function calculateForceVectorCustom() {
					return testVector;
				});
				scope.resizeFan = sinon.stub();

				scope.editFan = testFan;
				scope.fans.push(testFan);
			}));
			it('should update project modified date', function() {
				scope.fanPropertiesChange();
				expect(scope.projectDetails.dateModified).to.equal(testDate);
			});
			it('should update fan details', function() {
				scope.fanPropertiesChange();
				expect(scope.editFan.properties.dateModified).to.equal(testDate);
				expect(scope.editFan.properties.forceVector).to.equal(testVector);
			});
			it('should update fan lists', function() {
				scope.fanPropertiesChange();
				expect(scope.intakeFans.length).to.equal(1);
			});
		});
	});
	describe('Simulation Directive', function() {
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
		describe('updateStats', function() {		
			describe('with a positive amount of particles', function() {		
				beforeEach(inject(function(){
					//Stub out any method calls, we don't care about them in the context of this test	
					scope.updateFanRatioExplanation = sinon.stub();
					scope.updateParticleSuccessRatioExplanation = sinon.stub();
					scope.updateOverallRating = sinon.stub();
				
					scope.stats = new Object();
					scope.stats.removedParticles = 10;
					scope.stats.spawnedParticles = 20;
					scope.stats.activeParticles = 5;
					scope.stats.culledParticles = 5;

					scope.fans = ['a', 'b', 'c'];
					scope.intakeFans = ['a', 'b'];
					scope.exhaustFans = ['c'];

					scope.charts = new Object();

					scope.updateStats();
				}));
				it('number of fans should be correct', function() {					
					expect(scope.stats.numFans).to.equal(3);
					expect(scope.stats.numIntakeFans).to.equal(2);
					expect(scope.stats.numExhaustFans).to.equal(1);
				});
				it('particle success % should be 66.67%', function() {					
					expect(scope.stats.particleSuccessPercentage).to.equal("66.67%");
				});
				it('particle failure % should be 33.33%', function() {					
					expect(scope.stats.particleFailurePercentage).to.equal("33.33%");
				});
				it('particle live % should be 25.00%', function() {					
					expect(scope.stats.particleLivePercentage).to.equal("25.00%");
				});
			});
			describe('with no particles', function() {		
				beforeEach(inject(function(){
					//Stub out any method calls, we don't care about them in the context of this test	
					scope.updateFanRatioExplanation = sinon.stub();
					scope.updateParticleSuccessRatioExplanation = sinon.stub();
					scope.updateOverallRating = sinon.stub();
				
					scope.stats = new Object();
					scope.stats.removedParticles = 0;
					scope.stats.spawnedParticles = 0;
					scope.stats.activeParticles = 0;
					scope.stats.culledParticles = 0;

					scope.fans = ['a', 'b', 'c'];
					scope.intakeFans = ['a', 'b'];
					scope.exhaustFans = ['c'];

					scope.charts = new Object();

					scope.updateStats();
				}));
				it('number of fans should be correct', function() {					
					expect(scope.stats.numFans).to.equal(3);
					expect(scope.stats.numIntakeFans).to.equal(2);
					expect(scope.stats.numExhaustFans).to.equal(1);
				});
				it('particle success % should be 0%', function() {					
					expect(scope.stats.particleSuccessPercentage).to.equal("0%");
				});
				it('particle failure % should be 0%', function() {					
					expect(scope.stats.particleFailurePercentage).to.equal("0%");
				});
				it('particle live % should be 0%', function() {					
					expect(scope.stats.particleLivePercentage).to.equal("0%");
				});
			});
			describe('with non number amount of particles', function() {		
				beforeEach(inject(function(){
					//Stub out any method calls, we don't care about them in the context of this test	
					scope.updateFanRatioExplanation = sinon.stub();
					scope.updateParticleSuccessRatioExplanation = sinon.stub();
					scope.updateOverallRating = sinon.stub();
				
					scope.stats = new Object();
					scope.stats.removedParticles = "a";
					scope.stats.spawnedParticles = "a";
					scope.stats.activeParticles = "a";
					scope.stats.culledParticles = "a";

					scope.fans = ['a', 'b', 'c'];
					scope.intakeFans = ['a', 'b'];
					scope.exhaustFans = ['c'];

					scope.charts = new Object();

					scope.updateStats();
				}));
				it('number of fans should be correct', function() {					
					expect(scope.stats.numFans).to.equal(3);
					expect(scope.stats.numIntakeFans).to.equal(2);
					expect(scope.stats.numExhaustFans).to.equal(1);
				});
				it('particle success % should be 0%', function() {					
					expect(scope.stats.particleSuccessPercentage).to.equal("0%");
				});
				it('particle failure % should be 0%', function() {					
					expect(scope.stats.particleFailurePercentage).to.equal("0%");
				});
				it('particle live % should be 0%', function() {					
					expect(scope.stats.particleLivePercentage).to.equal("0%");
				});
			});
		});
		describe('createParticles', function() {
			describe('with 1 particle', function() {			
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(1);
				}));
				it('scope.particles length should be 1', function() {					
					expect(scope.particles.length).to.equal(1);
				});
				it('scope.availableParticles length should be 1', function() {					
					expect(scope.availableParticles.length).to.equal(1);
				});
			});
			describe('with 1000 particles', function() {			
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(1000);
				}));
				it('scope.particles length should be 1000', function() {					
					expect(scope.particles.length).to.equal(1000);
				});
				it('scope.availableParticles length should be 1000', function() {					
					expect(scope.availableParticles.length).to.equal(1000);
				});
			});
			describe('with -1 particle', function() {			
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(-1);
				}));
				it('scope.particles length should be 0', function() {					
					expect(scope.particles.length).to.equal(0);
				});
				it('scope.availableParticles length should be 0', function() {					
					expect(scope.availableParticles.length).to.equal(0);
				});
			});
			describe('with -1000 particles', function() {			
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(-1000);
				}));
				it('scope.particles length should be 0', function() {					
					expect(scope.particles.length).to.equal(0);
				});
				it('scope.availableParticles length should be 0', function() {					
					expect(scope.availableParticles.length).to.equal(0);
				});
			});
		});
	});
});