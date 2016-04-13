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
		var scope, MainController;

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

		beforeEach(module('js/directives/simulation.html'));
		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			MainController = $controller('MainController', {$scope: scope});
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
			}));
			it('projectDetails should be default values', function() {

				//Stub out any method calls, we don't care about them in the context of this test
				scope.emptyScene = sinon.stub();
				scope.init = sinon.stub();
				scope.animate = sinon.stub();
				scope.newProject();

				expect(scope.projectDetails.projectName).to.equal(projectDefault.projectName);
			 	expect(scope.projectDetails.author).to.equal(projectDefault.author);
			 	expect(scope.projectDetails.version).to.equal(projectDefault.version);
			});
			it('projectDetails date fields should be todays date', function() {

				//Stub out any method calls, we don't care about them in the context of this test
				scope.emptyScene = sinon.stub();
				scope.init = sinon.stub();
				scope.animate = sinon.stub();
				scope.newProject();

				var currentFormattedDate = scope.getCurrentDate();

				expect(scope.projectDetails.dateCreated).to.equal(currentFormattedDate);
			 	expect(scope.projectDetails.dateModified).to.equal(currentFormattedDate);

			});
			it('scope fan variables should be empty', function() {

				//Stub out any method calls, we don't care about them in the context of this test
				scope.emptyScene = sinon.stub();
				scope.init = sinon.stub();
				scope.animate = sinon.stub();
				scope.newProject();

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

				//Flush timouts for code beign tested
				$timeout.flush();

				//Verify there are no pending timouts
				$timeout.verifyNoPendingTasks();

				expect(scope.charts.drewCharts).to.be.true;
			}));
		});
	});
});
