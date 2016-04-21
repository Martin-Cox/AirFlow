describe('AirFlow Client Side', function() {

beforeEach(module('AirFlowApp'));
	describe('Defaults Service Unit Tests', function() {	
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
	describe('Main Controller Unit Tests', function() {
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
				loadFanStub = sinon.stub(scope, 'createFan', function loadFanCustom(fan) {
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
	describe('Simulation Directive Unit Tests', function() {

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
			describe('with 500 particles', function() {			
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(500);
				}));
				it('scope.particles length should be 1000', function() {
					this.timeout(5000);					
					expect(scope.particles.length).to.equal(500);
				});
				it('scope.availableParticles length should be 1000', function() {	
					this.timeout(5000);						
					expect(scope.availableParticles.length).to.equal(500);
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
			describe('with -500 particles', function() {			
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.createParticles(-500);
				}));
				it('scope.particles length should be 0', function() {	
					this.timeout(5000);						
					expect(scope.particles.length).to.equal(0);
				});
				it('scope.availableParticles length should be 0', function() {	
					this.timeout(5000);						
					expect(scope.availableParticles.length).to.equal(0);
				});
			});
		});
		describe('recycleParticle', function() {			
			beforeEach(inject(function(){
				scope.particles = [];
				scope.availableParticles = [];
				scope.createParticles(1);
				scope.availableParticles = [];
				//scope.recycleParticle(scope.particles[0]);
			}));
			it.skip('scope.particles length should be 1', function() {					
				expect(scope.particles.length).to.equal(1);
			});
			it.skip('scope.availableParticles length should be 1', function() {					
				expect(scope.availableParticles.length).to.equal(1);
			});
		});
		describe('cullParticles', function() {		
			describe('with 1 particle to be culled and 1 to remain', function() {		
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.stats = new Object();
					scope.stats.activeParticles = 2;
					scope.stats.culledParticles = 0;
					scope.createParticles(2);
					scope.particles[0].spawnTime = (new Date).getTime();
					scope.particles[1].spawnTime = (new Date).getTime() - 500000;
					scope.availableParticles = [];

					recycleParticleStub = sinon.stub(scope, 'recycleParticle', function recycleParticleCustom() {
						scope.availableParticles.push('a');
					});

					scope.cullParticles();
				}));
				it('particle stats should update', function() {	
					expect(scope.stats.activeParticles).to.equal(1);
					expect(scope.stats.culledParticles).to.equal(1);
				});
				it('scope.particles length should be 2', function() {					
					expect(scope.particles.length).to.equal(2);
				});
				it('scope.availableParticles length should be 1', function() {					
					expect(scope.availableParticles.length).to.equal(1);
				});
			});
			describe('with 50 particles to be culled and 75 to remain', function() {		
				beforeEach(inject(function(){
					scope.particles = [];
					scope.availableParticles = [];
					scope.stats = new Object();
					scope.stats.activeParticles = 125;
					scope.stats.culledParticles = 0;
					scope.createParticles(125);

					for (var i = 0; i < scope.particles.length; i++) {
						scope.particles[i].spawnTime = (new Date).getTime();
						if (i > 74) {
							scope.particles[i].spawnTime = scope.particles[i].spawnTime - 500000;
						}
					}

					scope.availableParticles = [];

					recycleParticleStub = sinon.stub(scope, 'recycleParticle', function recycleParticleCustom() {
						scope.availableParticles.push('a');
					});

					scope.cullParticles();
				}));
				it('particle stats should update', function() {	
					expect(scope.stats.activeParticles).to.equal(75);
					expect(scope.stats.culledParticles).to.equal(50);
				});
				it('scope.particles length should be 125', function() {					
					expect(scope.particles.length).to.equal(125);
				});
				it('scope.availableParticles length should be 50', function() {					
					expect(scope.availableParticles.length).to.equal(50);
				});
			});
		});
		describe('createFanAOEObject', function() {	
			describe('with loadingFan set to true, defaultCreation set to true', function() {		
				beforeEach(inject(function(){	
					scope.fanColors = 			 
						{
					    	"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
					  	}

					scope.fan = 	
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

					scope.defaultNewFanAOE = 
						{
							"dimensions": {
							    "radiusSegments": 25,
								"heightSegments": 25
							}
						}
				}));
				it('fanAOEObject geometry should be of type CylinderGeometry', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, true);	
					expect(fanAOEObject.geometry.type).to.equal("CylinderGeometry");
				});
				it('fanAOEObject height should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, true);	
					expect(fanAOEObject.geometry.parameters.height).to.equal(60);
				});
				it('fanAOEObject radius should be 60', function() {		
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, true);	
					expect(fanAOEObject.geometry.parameters.radiusTop).to.equal(60);
					expect(fanAOEObject.geometry.parameters.radiusBottom).to.equal(60);
				});
				it('fanAOEObject segments should be 25', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, true);	
					expect(fanAOEObject.geometry.parameters.heightSegments).to.equal(25);
					expect(fanAOEObject.geometry.parameters.radialSegments).to.equal(25);
				});
				it('fanAOEObject physijs collision flag should be 4', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, true);	
					expect(fanAOEObject._physijs.collision_flags).to.equal(4);
				});
			});
			describe('with loadingFan set to true, defaultCreation set to false', function() {		
				beforeEach(inject(function(){	
					scope.fanColors = 			 
						{
					    	"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
					  	}

					scope.fan = 	
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
					scope.defaultNewFanAOE = {
						"dimensions": {
						    "radiusSegments": 25,
							"heightSegments": 25
						}
					}
				}));
				it('fanAOEObject geometry should be of type CylinderGeometry', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, false);	
					expect(fanAOEObject.geometry.type).to.equal("CylinderGeometry");
				});
				it('fanAOEObject height should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, false);	
					expect(fanAOEObject.geometry.parameters.height).to.equal(60);
				});
				it('fanAOEObject radius should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, false);	
					expect(fanAOEObject.geometry.parameters.radiusTop).to.equal(60);
					expect(fanAOEObject.geometry.parameters.radiusBottom).to.equal(60);
				});
				it('fanAOEObject segments should be 25', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, false);	
					expect(fanAOEObject.geometry.parameters.heightSegments).to.equal(25);
					expect(fanAOEObject.geometry.parameters.radialSegments).to.equal(25);
				});
				it('fanAOEObject physijs collision flag should be 4', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, true, false);	
					expect(fanAOEObject._physijs.collision_flags).to.equal(4);
				});
			});
			describe('with loadingFan set to false, defaultCreation set to true', function() {		
				beforeEach(inject(function(){	
					scope.fanColors = 			 
						{
					    	"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
					  	}

					scope.fan = 	
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
				}));
				it('fanAOEObject geometry should be of type CylinderGeometry', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, true);	
					expect(fanAOEObject.geometry.type).to.equal("CylinderGeometry");
				});
				it('fanAOEObject height should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, true);	
					expect(fanAOEObject.geometry.parameters.height).to.equal(60);
				});
				it('fanAOEObject radius should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, true);	
					expect(fanAOEObject.geometry.parameters.radiusTop).to.equal(60);
					expect(fanAOEObject.geometry.parameters.radiusBottom).to.equal(60);
				});
				it('fanAOEObject segments should be 25', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, true);	
					expect(fanAOEObject.geometry.parameters.heightSegments).to.equal(25);
					expect(fanAOEObject.geometry.parameters.radialSegments).to.equal(25);
				});
				it('fanAOEObject physijs collision flag should be 4', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, true);	
					expect(fanAOEObject._physijs.collision_flags).to.equal(4);
				});
			});
			describe('with loadingFan set to false, defaultCreation set to false', function() {		
				beforeEach(inject(function(){	
					scope.fanColors = 			 
						{
					    	"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
					  	}

					scope.fan = 	
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
						      "heightSegments": 25,
						      "height" : 60
						    }
						  },
						  "properties": {
						    "size": 120,
						    "maxRPM": 1000,
						    "percentageRPM": 100,
						    "mode": "intake"
						  }
						}
				}));
				it('fanAOEObject geometry should be of type CylinderGeometry', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, false);	
					expect(fanAOEObject.geometry.type).to.equal("CylinderGeometry");
				});
				it('fanAOEObject height should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, false);	
					expect(fanAOEObject.geometry.parameters.height).to.equal(60);
				});
				it('fanAOEObject radius should be 60', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, false);	
					expect(fanAOEObject.geometry.parameters.radiusTop).to.equal(60);
					expect(fanAOEObject.geometry.parameters.radiusBottom).to.equal(60);
				});
				it('fanAOEObject segments should be 25', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, false);	
					expect(fanAOEObject.geometry.parameters.heightSegments).to.equal(25);
					expect(fanAOEObject.geometry.parameters.radialSegments).to.equal(25);
				});
				it('fanAOEObject physijs collision flag should be 4', function() {			
					var fanAOEObject = scope.createFanAOEObject(scope.fan, false, false);	
					expect(fanAOEObject._physijs.collision_flags).to.equal(4);
				});
			});
		});
		describe('calculateForceVector', function() {	
			beforeEach(inject(function(){	
					scope.fan = 	
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
						    "mode": "intake",
						    "active": true,
						    "position": 0
						  }
						}
				}));
			describe('using default fan', function() {		
				it('forceVector should be (0, 0, 70000) for an active fan', function() {		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(70000);
				});
				it('forceVector should be (0, 0, 0) for an inactive fan', function() {	
					scope.fan.properties.active = false;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(0);
				});
			});
			describe('different fan sizes (maxRPM 1000, 100% RPM)', function() {		
				it('forceVector should be (0, 0, 50000) for a small fan (80mm)', function() {	
					scope.fan.properties.size = 80;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(50000);
				});
				it('forceVector should be (0, 0, 70000) for a medium sized fan (120mm)', function() {	
					scope.fan.properties.size = 120;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(70000);
				});
				it('forceVector should be (0, 0, 80000) for a large fan (140mm)', function() {	
					scope.fan.properties.size = 140;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(80000);
				});
			});
			describe('different RPM (fan size 120mm, 100% RPM)', function() {		
				it('forceVector should be (0, 0, 60010) for RPM 1', function() {
					scope.fan.properties.maxRPM = 1;			
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(60010);
				});
				it('forceVector should be (0, 0, 75000) for RPM 1500', function() {
					scope.fan.properties.maxRPM = 1500;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(75000);
				});
				it('forceVector should be (0, 0, 89990) for RPM 2999', function() {	
					scope.fan.properties.maxRPM = 2999;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(89990);
				});
				it('forceVector should be (0, 0, 90000) for RPM 3000', function() {
					scope.fan.properties.maxRPM = 3000;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(90000);
				});
			});
			describe('different RPM% (fan size 120mm, maxRPM 1000)', function() {		
				it('forceVector should be (0, 0, 0) for 0% RPM', function() {
					scope.fan.properties.percentageRPM = 0;			
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(0);
				});
				it('forceVector should be (0, 0, 700) for 1% RPM', function() {
					scope.fan.properties.percentageRPM = 1;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(700);
				});
				it('forceVector should be (0, 0, 35000) for 50% RPM', function() {	
					scope.fan.properties.percentageRPM = 50;		
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(35000);
				});
				it('forceVector should be (0, 0, 69300) for 99% RPM', function() {
					scope.fan.properties.percentageRPM = 99;		
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(69300);
				});
				it('forceVector should be (0, 0, 70000) for 100% RPM', function() {
					scope.fan.properties.percentageRPM = 100;		
					var forceVector = scope.calculateForceVector(scope.fan);						
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(70000);
				});
			});
			describe('intake fan in different fan positions', function() {		
				it('front side should be (0, 0, 70000)', function() {
					scope.fan.properties.position = 0;			
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(70000);
				});
				it('back side should be (0, 0, -70000)', function() {
					scope.fan.properties.position = 1;		
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(-70000);
				});
				it('top side should be (0, -70000, 0)', function() {	
					scope.fan.properties.position = 2;		
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(-70000);
					expect(forceVector.z).to.equal(0);
				});
				it('bottom side should be (0, 70000, 0)', function() {
					scope.fan.properties.position = 3;		
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(70000);
					expect(forceVector.z).to.equal(0);
				});
				it('visible side should be (70000, 0, 0)', function() {
					scope.fan.properties.position = 4;		
					var forceVector = scope.calculateForceVector(scope.fan);						
					expect(forceVector.x).to.equal(70000);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(0);
				});
				it('invisible side should be (-70000, 0, 0)', function() {
					scope.fan.properties.position = 5;		
					var forceVector = scope.calculateForceVector(scope.fan);						
					expect(forceVector.x).to.equal(-70000);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(0);
				});
			});
			describe('exhaust fan in different fan positions', function() {		
				it('front side should be (0, 0, -70000)', function() {
					scope.fan.properties.position = 0;			
					scope.fan.properties.mode = "exhaust";	
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(-70000);
				});
				it('back side should be (0, 0, 70000)', function() {
					scope.fan.properties.position = 1;		
					scope.fan.properties.mode = "exhaust";	
					var forceVector = scope.calculateForceVector(scope.fan);	
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(70000);
				});
				it('top side should be (0, 70000, 0)', function() {	
					scope.fan.properties.position = 2;	
					scope.fan.properties.mode = "exhaust";		
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(70000);
					expect(forceVector.z).to.equal(0);
				});
				it('bottom side should be (0, -70000, 0)', function() {
					scope.fan.properties.position = 3;	
					scope.fan.properties.mode = "exhaust";		
					var forceVector = scope.calculateForceVector(scope.fan);
					expect(forceVector.x).to.equal(0);
					expect(forceVector.y).to.equal(-70000);
					expect(forceVector.z).to.equal(0);
				});
				it('visible side should be (-70000, 0, 0)', function() {
					scope.fan.properties.position = 4;	
					scope.fan.properties.mode = "exhaust";		
					var forceVector = scope.calculateForceVector(scope.fan);						
					expect(forceVector.x).to.equal(-70000);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(0);
				});
				it('invisible side should be (70000, 0, 0)', function() {
					scope.fan.properties.position = 5;
					scope.fan.properties.mode = "exhaust";			
					var forceVector = scope.calculateForceVector(scope.fan);						
					expect(forceVector.x).to.equal(70000);
					expect(forceVector.y).to.equal(0);
					expect(forceVector.z).to.equal(0);
				});
			});
		});
		describe('createDefaultCase', function() {	
			beforeEach(inject(function(){	
					scope.caseGroup = new Object();

					scope.caseDefault = 
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

					scope.positionsEnum = Object.freeze({
						FRONT: 0,
						BACK: 1,
						TOP: 2,
						BOTTOM: 3,
						VISIBLE_SIDE: 4,
						INVISIBLE_SIDE: 5
					});

			}));	
			it('caseGroup should contain case planes', function() {		
				scope._createDefaultCase(scope.caseDefault);	
				expect(scope.caseGroup).to.have.property('bottomPlane');
				expect(scope.caseGroup).to.have.property('topPlane');
				expect(scope.caseGroup).to.have.property('visibleSidePlane');
				expect(scope.caseGroup).to.have.property('invisibleSidePlane');
				expect(scope.caseGroup).to.have.property('backPlane');
				expect(scope.caseGroup).to.have.property('frontPlane');
			});
			it('invisibleSidePlane should be the only invisible plane', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.invisibleSidePlane.isInvisible).to.equal(true);
				expect(scope.caseGroup.bottomPlane.isInvisible).to.equal(false);
				expect(scope.caseGroup.topPlane.isInvisible).to.equal(false);
				expect(scope.caseGroup.visibleSidePlane.isInvisible).to.equal(false);
				expect(scope.caseGroup.backPlane.isInvisible).to.equal(false);
				expect(scope.caseGroup.frontPlane.isInvisible).to.equal(false);
			});
			it('case plane should have position codes', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.bottomPlane.positionCode).to.equal(scope.positionsEnum.BOTTOM);
				expect(scope.caseGroup.topPlane.positionCode).to.equal(scope.positionsEnum.TOP);
				expect(scope.caseGroup.invisibleSidePlane.positionCode).to.equal(scope.positionsEnum.INVISIBLE_SIDE);
				expect(scope.caseGroup.visibleSidePlane.positionCode).to.equal(scope.positionsEnum.VISIBLE_SIDE);
				expect(scope.caseGroup.backPlane.positionCode).to.equal(scope.positionsEnum.BACK);
				expect(scope.caseGroup.frontPlane.positionCode).to.equal(scope.positionsEnum.FRONT);
			});
			it('bottom plane properties should be correct', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.bottomPlane.dimensions.width).to.equal(scope.caseDefault.dimensions.width);
				expect(scope.caseGroup.bottomPlane.dimensions.height).to.equal(scope.caseDefault.dimensions.depth);
				expect(scope.caseGroup.bottomPlane.material._physijs.friction).to.equal(scope.caseDefault.materials.caseMaterial.friction);
				expect(scope.caseGroup.bottomPlane.material._physijs.restitution).to.equal(scope.caseDefault.materials.caseMaterial.restitution);
			});
			it('top plane properties should be correct', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.topPlane.dimensions.width).to.equal(scope.caseDefault.dimensions.width);
				expect(scope.caseGroup.topPlane.dimensions.height).to.equal(scope.caseDefault.dimensions.depth);
				expect(scope.caseGroup.topPlane.material._physijs.friction).to.equal(scope.caseDefault.materials.caseMaterial.friction);
				expect(scope.caseGroup.topPlane.material._physijs.restitution).to.equal(scope.caseDefault.materials.caseMaterial.restitution);
			});
			it('invisible side properties should be correct', function() {
				scope._createDefaultCase(scope.caseDefault);
				expect(scope.caseGroup.invisibleSidePlane.dimensions.width).to.equal(scope.caseDefault.dimensions.depth);
				expect(scope.caseGroup.invisibleSidePlane.dimensions.height).to.equal(scope.caseDefault.dimensions.height);
				expect(scope.caseGroup.invisibleSidePlane.material._physijs.friction).to.equal(scope.caseDefault.materials.transparentMaterial.friction);
				expect(scope.caseGroup.invisibleSidePlane.material._physijs.restitution).to.equal(scope.caseDefault.materials.transparentMaterial.restitution);
			});
			it('visible side properties should be correct', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.visibleSidePlane.dimensions.width).to.equal(scope.caseDefault.dimensions.depth);
				expect(scope.caseGroup.visibleSidePlane.dimensions.height).to.equal(scope.caseDefault.dimensions.height);
				expect(scope.caseGroup.visibleSidePlane.material._physijs.friction).to.equal(scope.caseDefault.materials.caseMaterial.friction);
				expect(scope.caseGroup.visibleSidePlane.material._physijs.restitution).to.equal(scope.caseDefault.materials.caseMaterial.restitution);
			});
			it('back plane properties should be correct', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.backPlane.dimensions.width).to.equal(scope.caseDefault.dimensions.width);
				expect(scope.caseGroup.backPlane.dimensions.height).to.equal(scope.caseDefault.dimensions.height);
				expect(scope.caseGroup.backPlane.material._physijs.friction).to.equal(scope.caseDefault.materials.caseMaterial.friction);
				expect(scope.caseGroup.backPlane.material._physijs.restitution).to.equal(scope.caseDefault.materials.caseMaterial.restitution);
			});
			it('front plane properties should be correct', function() {
				scope._createDefaultCase(scope.caseDefault);		
				expect(scope.caseGroup.frontPlane.dimensions.width).to.equal(scope.caseDefault.dimensions.width);
				expect(scope.caseGroup.frontPlane.dimensions.height).to.equal(scope.caseDefault.dimensions.height);
				expect(scope.caseGroup.frontPlane.material._physijs.friction).to.equal(scope.caseDefault.materials.caseMaterial.friction);
				expect(scope.caseGroup.frontPlane.material._physijs.restitution).to.equal(scope.caseDefault.materials.caseMaterial.restitution);
			});
		});
		describe('createFan', function() {	
			describe('creating a default fan (e.g. on new project)', function() {	
				beforeEach(inject(function(){	

					scope.getCurrentDate = function() {
					}

					getCurrentDateStub = sinon.stub(scope, 'getCurrentDate', function getCurrentDateCustom() {
						return "01/01/2015";
					});

					calculateForceVectorStub = sinon.stub(scope, 'calculateForceVector', function calculateForceVectorCustom() {
						var testVector = (0, 0, 50000);
						return testVector;
					});

					scope.determineFanAOEPosition = sinon.stub();

					scope.fanColors =
						{
							"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
						}

					scope.fans = [];
					scope.intakeFans = [];
					scope.exhaustFans = [];
					scope.projectDetails = new Object();

					scope.defaultNewFan = 
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
								"mode": "intake",
								"active": true,
								"position": 0,
								"forceVector" : {
									"x": 0,
									"y": 5000,
									"z": 30000
							    },
							},
							"position" : {
								"x": 0,
								"y": 100,
								"z": -248
						    }
						}

					scope.defaultNewFanAOE = 
						{
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
						}

					scope.fanObjects = scope._createFan(scope.defaultNewFan, false, true);
				}));	
				it('should be 2 fan objects returned', function() {		
					expect(scope.fanObjects.length).to.equal(2);
				});

				it('first object should be the fan physical object', function() {		
					expect(scope.fanObjects[0].dimensions.width).to.equal(scope.defaultNewFan.fanObject.dimensions.width);
					expect(scope.fanObjects[0].dimensions.height).to.equal(scope.defaultNewFan.fanObject.dimensions.height);
					expect(scope.fanObjects[0].dimensions.depth).to.equal(scope.defaultNewFan.fanObject.dimensions.depth);
					expect(scope.fanObjects[0].geometry.type).to.equal('BoxGeometry');
				});
				it('first object should be the fan AOE object', function() {	
					expect(scope.fanObjects[1].dimensions.radiusTop).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusTop);
					expect(scope.fanObjects[1].dimensions.radiusBottom).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusBottom);
					expect(scope.fanObjects[1].dimensions.radiusSegments).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusSegments);
					expect(scope.fanObjects[1].dimensions.heightSegments).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.heightSegments);
					expect(scope.fanObjects[1].dimensions.height).to.equal(60);
					expect(scope.fanObjects[1].geometry.type).to.equal('CylinderGeometry');
				});
				it('should have created 1 intake fan', function() {		
					expect(scope.fans.length).to.equal(1);
					expect(scope.intakeFans.length).to.equal(1);
					expect(scope.exhaustFans.length).to.equal(0);
				});
				it('fan object should have properties', function() {		
					expect(scope.fans[0].fanAOEObject).to.equal(scope.fanObjects[1]);
					expect(scope.fans[0].fanPhysicalObject).to.equal(scope.fanObjects[0]);
					expect(scope.fans[0].properties.mode).to.equal(scope.defaultNewFan.properties.mode);
					expect(scope.fans[0].properties.maxRPM).to.equal(scope.defaultNewFan.properties.maxRPM);
					expect(scope.fans[0].properties.percentageRPM).to.equal(scope.defaultNewFan.properties.percentageRPM);
					expect(scope.fans[0].properties.isValidPos).to.equal(true);
				});
			});
			describe('creating a new fan', function() {	
				beforeEach(inject(function(){	

					scope.getCurrentDate = function() {
					}

					getCurrentDateStub = sinon.stub(scope, 'getCurrentDate', function getCurrentDateCustom() {
						return "01/01/2015";
					});

					calculateForceVectorStub = sinon.stub(scope, 'calculateForceVector', function calculateForceVectorCustom() {
						var testVector = (0, 0, 50000);
						return testVector;
					});

					scope.determineFanAOEPosition = sinon.stub();

					scope.fanColors =
						{
							"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
						}

					scope.fans = [];
					scope.intakeFans = [];
					scope.exhaustFans = [];
					scope.projectDetails = new Object();

					scope.defaultNewFan = 
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
								"mode": "intake",
								"active": true,
								"position": 0,
								"forceVector" : {
									"x": 0,
									"y": 5000,
									"z": 30000
							    },
							},
							"position" : {
								"x": 0,
								"y": 100,
								"z": -248
						    }
						}

					scope.defaultNewFanAOE = 
						{
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
						}

					scope.newFanPlaceholderObjectPosition = 0;

					scope.newFanPlaceholderObject = 
						{
							"position": {
								"x": 100,
								"y": 100,
								"z": 100
							}
						}

					scope.fanObjects = scope._createFan(null, false, true);
				}));	
				it('should be 2 fan objects returned', function() {		
					expect(scope.fanObjects.length).to.equal(2);
				});

				it('first object should be the fan physical object', function() {		
					expect(scope.fanObjects[0].dimensions.width).to.equal(scope.defaultNewFan.fanObject.dimensions.width);
					expect(scope.fanObjects[0].dimensions.height).to.equal(scope.defaultNewFan.fanObject.dimensions.height);
					expect(scope.fanObjects[0].dimensions.depth).to.equal(scope.defaultNewFan.fanObject.dimensions.depth);
					expect(scope.fanObjects[0].geometry.type).to.equal('BoxGeometry');
				});
				it('first object should be the fan AOE object', function() {	
					expect(scope.fanObjects[1].dimensions.radiusTop).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusTop);
					expect(scope.fanObjects[1].dimensions.radiusBottom).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusBottom);
					expect(scope.fanObjects[1].dimensions.radiusSegments).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusSegments);
					expect(scope.fanObjects[1].dimensions.heightSegments).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.heightSegments);
					expect(scope.fanObjects[1].dimensions.height).to.equal(60);
					expect(scope.fanObjects[1].geometry.type).to.equal('CylinderGeometry');
				});
				it('should have created 1 intake fan', function() {		
					expect(scope.fans.length).to.equal(1);
					expect(scope.intakeFans.length).to.equal(1);
					expect(scope.exhaustFans.length).to.equal(0);
				});
				it('fan object should have properties', function() {		
					expect(scope.fans[0].fanAOEObject).to.equal(scope.fanObjects[1]);
					expect(scope.fans[0].fanPhysicalObject).to.equal(scope.fanObjects[0]);
					expect(scope.fans[0].properties.mode).to.equal(scope.defaultNewFan.properties.mode);
					expect(scope.fans[0].properties.maxRPM).to.equal(scope.defaultNewFan.properties.maxRPM);
					expect(scope.fans[0].properties.percentageRPM).to.equal(scope.defaultNewFan.properties.percentageRPM);
					expect(scope.fans[0].properties.isValidPos).to.equal(true);
				});
			});
			describe('loading a fan from a project file', function() {	
				beforeEach(inject(function(){	

					scope.getCurrentDate = function() {
					}

					getCurrentDateStub = sinon.stub(scope, 'getCurrentDate', function getCurrentDateCustom() {
						return "01/01/2015";
					});

					calculateForceVectorStub = sinon.stub(scope, 'calculateForceVector', function calculateForceVectorCustom() {
						var testVector = (0, 0, 50000);
						return testVector;
					});

					scope.determineFanAOEPosition = sinon.stub();

					scope.fanColors =
						{
							"normal": "0x003566",
						    "inactive": "0x99AEC1",
						    "highlight": "0x4D82B3",
						    "validEdit": "0x519C52",
						    "invalidEdit": "0xCF5157",
						    "wireframe": "0x90DAFF"
						}

					scope.fans = [];
					scope.intakeFans = [];
					scope.exhaustFans = [];
					scope.projectDetails = new Object();

					scope.defaultNewFan = 
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
								"mode": "intake",
								"active": true,
								"position": 0,
								"forceVector" : {
									"x": 0,
									"y": 5000,
									"z": 30000
							    },
							},
							"position" : {
								"x": 0,
								"y": 100,
								"z": -248
						    }
						}

					scope.defaultNewFanAOE = 
						{
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
						}

					scope.newFanPlaceholderObjectPosition = 0;

					scope.newFanPlaceholderObject = 
						{
							"position": {
								"x": 100,
								"y": 100,
								"z": 100
							}
						}

				    scope.loadFan = 
							{
								"properties": {
									"mode": "intake",
									"size": 120,
									"maxRPM": 1000,
									"percentageRPM": 100,
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

					scope.fanObjects = scope._createFan(scope.loadFan, true, false);
				}));	
				it('should be 2 fan objects returned', function() {		
					expect(scope.fanObjects.length).to.equal(2);
				});

				it('first object should be the fan physical object', function() {		
					expect(scope.fanObjects[0].dimensions.width).to.equal(scope.defaultNewFan.fanObject.dimensions.width);
					expect(scope.fanObjects[0].dimensions.height).to.equal(scope.defaultNewFan.fanObject.dimensions.height);
					expect(scope.fanObjects[0].dimensions.depth).to.equal(scope.defaultNewFan.fanObject.dimensions.depth);
					expect(scope.fanObjects[0].geometry.type).to.equal('BoxGeometry');
				});
				it('first object should be the fan AOE object', function() {	
					expect(scope.fanObjects[1].dimensions.radiusSegments).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.radiusSegments);
					expect(scope.fanObjects[1].dimensions.heightSegments).to.equal(scope.defaultNewFan.fanAOEObject.dimensions.heightSegments);
					expect(scope.fanObjects[1].dimensions.height).to.equal(60);
					expect(scope.fanObjects[1].geometry.type).to.equal('CylinderGeometry');
				});
				it('should have created 1 intake fan', function() {		
					expect(scope.fans.length).to.equal(1);
					expect(scope.intakeFans.length).to.equal(1);
					expect(scope.exhaustFans.length).to.equal(0);
				});
				it('fan object should have properties', function() {		
					expect(scope.fans[0].fanAOEObject).to.equal(scope.fanObjects[1]);
					expect(scope.fans[0].fanPhysicalObject).to.equal(scope.fanObjects[0]);
					expect(scope.fans[0].properties.mode).to.equal(scope.defaultNewFan.properties.mode);
					expect(scope.fans[0].properties.maxRPM).to.equal(scope.defaultNewFan.properties.maxRPM);
					expect(scope.fans[0].properties.percentageRPM).to.equal(scope.defaultNewFan.properties.percentageRPM);
					expect(scope.fans[0].properties.isValidPos).to.equal(true);
				});	
			});
		});
	});
});	
