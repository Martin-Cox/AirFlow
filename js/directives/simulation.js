var simulation = function($http, defaultsService, $timeout) {
  return { 
    restrict: 'E', 
    scope: false,
    templateUrl: 'js/directives/simulation.html',
    link: function(scope, elem, attr) {

    	var camera, scene, width, height, clock, orbitControl, fpsStats, intersectedObject;
    	var simPaused = false;
    	var renderer = null;
		var particles = [];
		var availableParticles = [];
		var THREE = require('three');
		var OrbitControls = require('three-orbit-controls')(THREE);
		var Physijs = require('physijs-browserify')(THREE);
		var Chart = require('chart.js');

		//Enum of possible fan positions on the case (which part of the case is the fan on)
		var positionsEnum = Object.freeze({
			FRONT: 0,
			BACK: 1,
			TOP: 2,
			BOTTOM: 3,
			VISIBLE_SIDE: 4,
			INVISIBLE_SIDE: 5
		});

		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		var offset = new THREE.Vector3();

		getDefaults();

		/*Loads all the default values (defaultFans, defaultProjectDetails etc.) using defaultsService and sets scope.ajaxComplete to true when all files have been loaded*/
		function getDefaults() {
			var caseDefaultsPromise = defaultsService.getCaseDefaults();
			caseDefaultsPromise.then(function(result) {
				scope.defaultCase = result;
				var fanDefaultsPromise = defaultsService.getFanDefaults();
				fanDefaultsPromise.then(function(result) {
					scope.fanColors = result.colors;
					scope.defaultFans = result;
					scope.defaultNewFanAOE = result.fanOne.fanAOEObject;
					var newFanDefaultsPromise = defaultsService.getNewFanDefaults();
					newFanDefaultsPromise.then(function(result) {
						scope.defaultNewFan = result;
						var projectDetailsDefaultsPromise = defaultsService.getProjectDetailsDefaults();
						projectDetailsDefaultsPromise.then(function(result) {
							scope.defaultProjectDetails = result;
							var statsAnalysisPromise = defaultsService.getStatsAnalysis();
							statsAnalysisPromise.then(function(result) {
								scope.statsAnalysis = result;
								//Need to change this value after all AJAX calls have completed to notify controller that loading has completed
								document.getElementById("loadingSplashLoadingText").innerHTML = "Click anywhere to begin";
								scope.ajaxComplete = true;
							});
						});
					});
				});
			});
		}

		/*Creates the particle success ratio chart. Should only be called once. Updates are handled by scope.updateStats()*/
		scope.drawParticleSuccessRatioChart = function() {
	 		var context = document.getElementById("particleSuccessRatioChart").getContext("2d");

	        var data = [
	            {
	                value: scope.stats.removedParticles,
	                color: "#519C52",
	                highlight: "#519C52",
	            },
	            {
	                value: scope.stats.culledParticles,
	                color: "#CF5157",
	                highlight: "#CF5157",
	            }
	        ]   

	        scope.charts.particleSuccessRatioChart = new Chart(context).Doughnut(data, {segmentStrokeColor : "#F5F5F5", animationEasing: "easeOutQuint", animateRotate : false, animateScale : true});
		}

		/*Creates the fan ratio chart. Should only be called once. Updates are handled by scope.updateStats()*/
		scope.drawFanRatioChart = function() {
	 		var context = document.getElementById("fanRatioChart").getContext("2d");

	        var data = [
	            {
	                value: scope.stats.numIntakeFans,
	                color: "#4D82B3",
	                highlight: "#4D82B3",
	            },
	            {
	                value: scope.stats.numExhaustFans,
	                color: "#003566",
	                highlight: "#003566",
	            }
	        ]   

	        scope.charts.fanRatioChart = new Chart(context).Doughnut(data, {segmentStrokeColor : "#F5F5F5", animationEasing: "easeOutQuint", animateRotate : false, animateScale : true});
		}

		/*Removes all objects from the 3D scene (fan objects, particles, case planes etc.)*/
		scope.emptyScene = function() {
			if (scene) {
				var obj = null;
				for(var i = scene.children.length - 1; i >= 0; i--) { 
					obj = scene.children[i];
    				scene.remove(obj);
				}
	        }
		}

		/*Removes all fans (fanPhysicalObjects, fanAOEObjects, fanWireframe) and particles from the 3D scene*/
		scope.removeFansAndParticles = function() {			
	        //Remove all fans and particles from scene
	        var obj = null;
	        for(var i = scene.children.length - 1; i >= 0; i--) { 
	            obj = scene.children[i];
	            for (var j = 0; j < scope.fans.length; j++) {
	            	if (obj.id == scope.fans[j].fanPhysicalObject.id || obj.id == scope.fans[j].fanAOEObject.id || obj.id == scope.fans[j].AOEWireframe.id) {
						scene.remove(obj);
	            	}
	            }
	            for (var j = 0; j < particles.length; j++) {
	            	if (obj.id == particles[j].id) {
						scene.remove(obj);
	            	}
	            }
	        }
		}

		/*Loads any extra files needed, initialises 3D scene, creates render, lights, canera, default fauns/case etc.*/
		scope.init = function() {
			if (renderer === null) {
				//First time calling init, need to create renderer, scene, attach scripts etc.

				Physijs.scripts.worker = '/js/external/physijs_worker.js';
				Physijs.scripts.ammo = '/js/external/ammo.js';

				window.addEventListener( 'resize', onWindowResize, false);

				width = document.getElementById('simulationContainer').offsetWidth;
				height = document.getElementById('simulationContainer').offsetHeight;

				fpsStats = new Stats();
				fpsStats.setMode(0);

				fpsStats.domElement.style.position = 'absolute';
				fpsStats.domElement.style.right = '0px';
				fpsStats.domElement.style.bottom = '0px';

				document.getElementById("simulationContainer").appendChild(fpsStats.domElement);

			
				renderer = new THREE.WebGLRenderer ( { antialias: true});
				renderer.setSize(width, height);
				document.getElementById("simulationContainer").appendChild(renderer.domElement);

				scene = new Physijs.Scene;

				scene.setGravity(new THREE.Vector3( 0, 12, 0));

				camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);

				camera.position.x = 800;
				camera.position.y = 800;
				camera.position.z = -800;

				scene.add(camera);

				orbitControl = new OrbitControls(camera, document.getElementById('simulationContainer'));
				//orbitControl.enablePan = false;
				orbitControl.constraint.minDistance = 600;
				orbitControl.constraint.maxDistance = 2200;
				clock = new THREE.Clock();
				scope.spawnParticles();
				scope.cullParticles();
				scope.updateStats();
			}

			scope.createParticles(100);

			scope.createDefaultCase(scope.defaultCase);

			//Clone the default fans, otherwise the default fan properties will get overriden if we attempt to modify them
			var defaultFansCopy = (JSON.parse(JSON.stringify(scope.defaultFans)));

            var fans = [];

            var fans = Object.keys(defaultFansCopy).map(function(k) { return defaultFansCopy[k] });

            for (var i = 0; i < fans.length-1; i++) {     
                scope.createFan(fans[i]);
            }

			var skyboxGeometry = new THREE.CubeGeometry(9000, 9000, 9000);
			var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x262B30, side: THREE.BackSide });
			var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

			scene.add(skybox);

			scope.stats.spawnedParticles = 0;
			scope.stats.activeParticles = 0;
			scope.stats.culledParticles = 0;
			scope.stats.removedParticles = 0;
			scope.stats.particleSuccessPercentage = 0;
			scope.stats.particleFailurePercentage = 0;
			scope.stats.particleSuccessRatioVal = "";
			scope.stats.particleSuccessRatioMod = 0;
			

			var topLight = new THREE.DirectionalLight(0xffffff, 1);
			topLight.position.set(0, 1, 0);

			var bottomLight = new THREE.DirectionalLight(0xffffff, 0.5);
			bottomLight.position.set(0, -1, 0);

			scene.add(topLight);	
			scene.add(bottomLight);

			var pointLightA = new THREE.PointLight(0xffffff, 0.75);
			pointLightA.position.set(0, -100, -400);

			var pointLightB = new THREE.PointLight(0xffffff, 0.75);
			pointLightB.position.set(-600, 0, -800);

			scene.add(pointLightA);	
			scene.add(pointLightB);	

			scene.add(new THREE.AxisHelper(200));

			renderer.domElement.addEventListener('touchmove', handleMouseMove, false);
			renderer.domElement.addEventListener('mousemove', handleMouseMove, false);
			renderer.domElement.addEventListener('mousedown', handleMouseClick, false);
			renderer.domElement.addEventListener('mouseup', handleMouseRelease, false);

			document.addEventListener("visibilitychange", scope.handleVisibilityChange, false);
		}

		/*Pauses the simulation when the browser tab focus is lost (e.g. user clicks on a different browser tab)*/
		scope.handleVisibilityChange = function() {
			if (document.hidden) {
				simPaused = true;				
			} else  {
				simPaused = false;
				scene.onSimulationResume();
			}
		}

		/*Animates and simulates physics for the 3D scene*/
		scope.animate = function() {
			//Animates/simulates scene

			fpsStats.begin();

			//Pause simulation
			if (simPaused != true) {
				scene.simulate(); //Run physics simulation
			}		

			requestAnimationFrame(scope.animate);
			var delta = clock.getDelta();
			orbitControl.update(delta);

			renderer.render(scene, camera);

			fpsStats.end();
		}

		/*Recalculates the stats for a scene, updates charts, and calls the functions to update chart explanations
		  This function calls itself every 1s, and should only be started once*/
		scope.updateStats = function() {
			scope.stats.particleRatio = 100;

			var successRatio, failureRatio, liveRatio;

			scope.stats.numFans = scope.fans.length;
			scope.stats.numIntakeFans = scope.intakeFans.length;
			scope.stats.numExhaustFans = scope.exhaustFans.length;

			successRatio = ((scope.stats.removedParticles/(scope.stats.spawnedParticles - scope.stats.activeParticles))*100).toFixed(2);
			failureRatio = ((scope.stats.culledParticles/(scope.stats.spawnedParticles - scope.stats.activeParticles))*100).toFixed(2);
			liveRatio = ((scope.stats.activeParticles/scope.stats.spawnedParticles)*100).toFixed(2);

			if (isNaN(successRatio)) {
				successRatio = 0;
			}

			if (isNaN(failureRatio)) {
				failureRatio = 0;
			}

			if (isNaN(liveRatio)) {
				liveRatio = 0;
			}

			if(successRatio === 0 && failureRatio === 0) {
				//This should only be called at the initialisation of a new project
				//Need to override 0, 0 values with something otherwise no chart will be drawn
				//By doing this we fake the chart data so that it looks like 100% of particles are successful
				//The chart will update to real values after a couple of seconds, which is way before any particles will have been culled
				//So the end result is no different for the user than if we didn't have to do this
				var ratioSegSuccess = 1;
				var ratioSegFailure = 0;
			} else {
				var ratioSegSuccess = scope.stats.removedParticles;
				var ratioSegFailure = scope.stats.culledParticles;
			}

			scope.stats.particleSuccessPercentage = successRatio + "%";
			scope.stats.particleFailurePercentage = failureRatio + "%";
			scope.stats.particleLivePercentage = liveRatio + "%";

			//Update explanations
			scope.updateFanRatioExplanation();
			scope.updateParticleSuccessRatioExplanation();
			scope.updateOverallRating();

			if (scope.charts.particleSuccessRatioChart != null || scope.charts.particleSuccessRatioChart != undefined) {
				scope.charts.particleSuccessRatioChart.segments[0].value = ratioSegSuccess;
				scope.charts.particleSuccessRatioChart.segments[1].value = ratioSegFailure;
				scope.charts.particleSuccessRatioChart.update();
			}

			if (scope.charts.fanRatioChart != null || scope.charts.fanRatioChart != undefined) {
				scope.charts.fanRatioChart.segments[0].value = scope.stats.numIntakeFans;
				scope.charts.fanRatioChart.segments[1].value = scope.stats.numExhaustFans;
				scope.charts.fanRatioChart.update();
				
			}
			$timeout(function() {
	        	scope.updateStats();
	        }, 1000);
		}

		/*Determines the final rating given to a project. Factors that affect the final rating include:
		  The Number of fans (too few, good amount, too many)
		  The ratio of successful particles to culled particles (too many culled particles etc.)*/
		scope.updateOverallRating = function() {
				//Update final rating

				var breakdownTitle = document.getElementById("overallRatingTitle");
				var breakdownNumFans = document.getElementById("breakdownNumFans");
				var breakdownParticleSuccessRatio = document.getElementById("breakdownParticleSuccessRatio");


				//Calculate score out of 5
				var rating = 0;
				var textRating = "";
				var numFansBreakdownExplanation = "";
				var particleSuccessRatioBreakdownExplanation = "";


				if (scope.stats.numFans > 8) {
					//Too many fans
					numFansBreakdownExplanation = scope.statsAnalysis.overall.numFans.tooMany.val;
					rating += scope.statsAnalysis.overall.numFans.tooMany.mod;
				} else if (scope.stats.numFans > 2) {
					//Good amount of fans
					numFansBreakdownExplanation = scope.statsAnalysis.overall.numFans.goodAmount.val;
					rating += scope.statsAnalysis.overall.numFans.goodAmount.mod;
				} else if (scope.stats.numFans <= 2) {
					//Too few fans
					numFansBreakdownExplanation = scope.statsAnalysis.overall.numFans.tooFew.val;
					rating += scope.statsAnalysis.overall.numFans.tooFew.mod;
				}

				numFansBreakdownExplanation = numFansBreakdownExplanation + " +" + rating;

				particleSuccessRatioBreakdownExplanation = scope.stats.particleSuccessRatioVal + " +" + scope.stats.particleSuccessRatioMod;
				rating += scope.stats.particleSuccessRatioMod;

				if (rating > 3) {
					//Good rating
					textRating = scope.statsAnalysis.overall.result.good + " " + rating + "/5";
				} else if (rating > 2) {
					//Average rating
					textRating = scope.statsAnalysis.overall.result.average + " " + rating + "/5";
				} else {
					//Bad rating
					textRating = scope.statsAnalysis.overall.result.bad + " " + rating + "/5";
				}

				breakdownTitle.innerHTML = textRating;
				breakdownNumFans.innerHTML = numFansBreakdownExplanation;
				breakdownParticleSuccessRatio.innerHTML = particleSuccessRatioBreakdownExplanation;

		}

		/*Updates textual explanations for the fan ratio chart*/
		scope.updateFanRatioExplanation = function() {
				//Update explanations

				var explanationTitle = document.getElementById("fanRatioExplanationTitle");
				var explanationDesc = document.getElementById("fanRatioExplanationDesc");

				if (scope.stats.numIntakeFans > scope.stats.numExhaustFans) {
					explanationTitle.innerHTML = scope.statsAnalysis.fanRatio.moreIntake.val;
					explanationDesc.innerHTML = scope.statsAnalysis.fanRatio.moreIntake.desc;
				} else if (scope.stats.numExhaustFans > scope.stats.numIntakeFans) {
					explanationTitle.innerHTML = scope.statsAnalysis.fanRatio.moreExhaust.val;
					explanationDesc.innerHTML = scope.statsAnalysis.fanRatio.moreExhaust.desc;
				} else if (scope.stats.numIntakeFans === scope.stats.numExhaustFans) {
					explanationTitle.innerHTML = scope.statsAnalysis.fanRatio.equal.val;
					explanationDesc.innerHTML = scope.statsAnalysis.fanRatio.equal.desc;
				}
		}

		/*Updates textual explanations for the particle success ratio chart*/
		scope.updateParticleSuccessRatioExplanation = function() {
				var explanationTitle = document.getElementById("particleSuccessRatioExplanationTitle");
				var explanationDesc = document.getElementById("particleSuccessRatioExplanationDesc");

				var failPercentageNum = scope.stats.particleFailurePercentage.replace("%", "");

				if (failPercentageNum > 50) {
					//Bad
					explanationTitle.innerHTML = scope.statsAnalysis.particleSuccessRatio.bad.val;
					explanationDesc.innerHTML = scope.statsAnalysis.particleSuccessRatio.bad.desc;
					scope.stats.particleSuccessRatioVal = scope.statsAnalysis.overall.particleSuccessRatio.bad.val;
					scope.stats.particleSuccessRatioMod = scope.statsAnalysis.overall.particleSuccessRatio.bad.mod;
				} else if (failPercentageNum > 25) {
					//Average
					explanationTitle.innerHTML = scope.statsAnalysis.particleSuccessRatio.average.val;
					explanationDesc.innerHTML = scope.statsAnalysis.particleSuccessRatio.average.desc;
					scope.stats.particleSuccessRatioVal = scope.statsAnalysis.overall.particleSuccessRatio.average.val;
					scope.stats.particleSuccessRatioMod = scope.statsAnalysis.overall.particleSuccessRatio.average.mod;
				} else {
					//Good
					explanationTitle.innerHTML = scope.statsAnalysis.particleSuccessRatio.good.val;
					explanationDesc.innerHTML = scope.statsAnalysis.particleSuccessRatio.good.desc;
					scope.stats.particleSuccessRatioVal = scope.statsAnalysis.overall.particleSuccessRatio.good.val;
					scope.stats.particleSuccessRatioMod = scope.statsAnalysis.overall.particleSuccessRatio.good.mod;
				}
		}

		/*Creates the pool of particles that will be added to the scene
		  numToCreate = The size of the pool of particles*/
		scope.createParticles = function(numToCreate) { 
			particles = [];
			availableParticles = [];

			for (var i = 0; i < numToCreate; i++) {
				var particle;

				var randNum = Math.random();

				var sphereGeometry = new THREE.SphereGeometry(5, 16, 16);

				var sphereMaterial = Physijs.createMaterial(
			      new THREE.MeshLambertMaterial({
			        color: 0x18ABDB
			      }),
			      0.3, // friction
			      1 // restitution
			    );

				particle = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);	

				particle.addEventListener('collision', handleParticleToFanCollision);

				particles.push(particle);
				availableParticles.push(particle);
			}
		}

		/*Adds the first available particle to the scene every spawnRate ms. If none are available, wait spawnRate ms and check again*/
		scope.spawnParticles = function() {
			var spawnRate = 300;

			if (availableParticles.length > 0 && scope.intakeFans.length > 0) {

				var activeIntakeFans = [];

				for (var i = 0; i < scope.intakeFans.length; i++) {
					if (scope.intakeFans[i].properties.active === true) {
						activeIntakeFans.push(scope.intakeFans[i]);
					}
				}

				if (activeIntakeFans.length > 0) {
					//Set spawn position as the particle is created
					scope.setParticleStartingPosition(availableParticles[0], activeIntakeFans);

					//Record the unix time ms that the particle spawned
					availableParticles[0].spawnTime = (new Date).getTime();
					
					//Reset the colour to blue again
					availableParticles[0].material.color.setHex(0x18ABDB);


					//Add first available particle to scene
					scene.add(availableParticles[0]);

					//Remove from pool of available particles
					availableParticles.splice(0, 1);

					//Add to total no. spawned particles
					scope.stats.spawnedParticles += 1;
					scope.stats.activeParticles += 1;
				}

				$timeout(function() {
		        	scope.spawnParticles();
		        }, spawnRate);
			} else {
				$timeout(function() {
		        	scope.spawnParticles();
		        }, spawnRate);
			}
		}

		/*Chooses a random intake fan to act as a spawning point, then chooses a random 3D coordinate inside the fanAOEObject for that intake fan
		  particle = The particle to spawn*/
		scope.setParticleStartingPosition = function(particle, activeIntakeFans) {
			//Randomly select one of the intake fans to act as a spawn point for this particle
			var fanObject = activeIntakeFans[Math.floor(Math.random()*activeIntakeFans.length)];

			var spawnPosition = new THREE.Vector3();

			var fanAOEObjectHeight = fanObject.fanAOEObject.geometry.parameters.height;
			var fanAOEObjectRadius = fanObject.fanAOEObject.geometry.parameters.radiusBottom;

			//Calculate the maximum and mimimum coordinates for where the fanAOEObject is
			var maxX = fanObject.fanAOEObject.position.x + fanAOEObjectRadius/2;
			var minX = fanObject.fanAOEObject.position.x - fanAOEObjectRadius/2;

			var maxY = fanObject.fanAOEObject.position.y + fanAOEObjectRadius/2;
			var minY = fanObject.fanAOEObject.position.y - fanAOEObjectRadius/2;

			var maxZ = fanObject.fanAOEObject.position.z + fanAOEObjectHeight/2;
			var minZ = fanObject.fanAOEObject.position.z - fanAOEObjectHeight/2;

			//Randomise the position the particle will spawn in the fanAOEObject
			spawnPosition.x = Math.floor(Math.random()*(maxX-minX+1)+minX);
			spawnPosition.y = Math.floor(Math.random()*(maxY-minY+1)+minY);
			spawnPosition.z = Math.floor(Math.random()*(maxZ-minZ+1)+minZ);

			//Reset particle position at a random intake fan
			particle.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);

			return particle;
		}

		/*Removes a particle from the scene and adds it back to the pool of available particles*/
		scope.recycleParticle = function(particle) {
			scene.remove(particle);

			particle.spawnTime = null;

			availableParticles.push(particle);
		}

		/*Removes and recycles a particle from the 3D scene if it has existed for too long*/
		scope.cullParticles = function() {	
			var recheckTime = 500; //0.5 second, debug value

			if (particles.length > 0) {

				var cullTime = 30000; //30 seconds, debug value
				
				//Change color times
				var medTime = 10000;
				var longTime = 20000;

				var unixTime = (new Date).getTime();

				for (var i = 0; i < particles.length; i++) {
					if (particles[i].spawnTime != null && unixTime - particles[i].spawnTime >= cullTime) {
						scope.recycleParticle(particles[i]);
						scope.stats.culledParticles += 1;
						scope.stats.activeParticles -= 1;
						scope.$digest();
					}
					if (particles[i].spawnTime != null && unixTime - particles[i].spawnTime >= medTime) {
						//Particle has been around for a medium amount of time, turn orange
						particles[i].material.color.setHex(0xFDBD5C);
					} 
					if (particles[i].spawnTime != null && unixTime - particles[i].spawnTime >= longTime) {
						//Particle has been around for a long amount of time, turn red
						particles[i].material.color.setHex(0xD9216A);
					}
				}

				$timeout(function() {
		        	scope.cullParticles();
		        }, recheckTime);
			} else {
				$timeout(function() {
		        	scope.cullParticles();
		        }, recheckTime);
			}
		}

		/*Creates a 3D model of a computer case using Box meshes. This function should only be used to create a case
		  by using the default case values
		  caseDefaults = The object containing the default case values (size, material colour etc.)*/
		scope.createDefaultCase = function(caseDefaults) {
			//Creates a 3D model of a computer case

			var caseMaterial = Physijs.createMaterial(
		      	new THREE.MeshLambertMaterial({
					color: parseInt(caseDefaults.materials.caseMaterial.color)
				}),
		      	caseDefaults.materials.caseMaterial.friction,
		      	caseDefaults.materials.caseMaterial.restitution
		    );

			var transparentMaterial = Physijs.createMaterial(
				new THREE.MeshBasicMaterial({ 
				    opacity: caseDefaults.materials.transparentMaterial.opacity,
				    color: parseInt(caseDefaults.materials.transparentMaterial.color),
				    transparent: caseDefaults.materials.transparentMaterial.transparent,
				    side: caseDefaults.materials.transparentMaterial.side
				}),
				caseDefaults.materials.transparentMaterial.friction,
				caseDefaults.materials.transparentMaterial.restitution
			);

			var componentMaterial = Physijs.createMaterial(
		      	new THREE.MeshLambertMaterial({
					color: parseInt(caseDefaults.materials.componentMaterial.color)
				}),
		      	caseDefaults.materials.componentMaterial.friction,
		      	caseDefaults.materials.componentMaterial.restitution
		    );

			var caseWidth = caseDefaults.dimensions.width;
			var caseHeight = caseDefaults.dimensions.height;
			var caseDepth = caseDefaults.dimensions.depth;
			var caseThickness = caseDefaults.dimensions.thickness;
			var fanHoleSize = caseDefaults.dimensions.fanHoleSize;

			var caseBottomPlane = new Physijs.BoxMesh(new THREE.CubeGeometry(caseWidth, caseThickness, caseDepth), caseMaterial, 0); //Gravity, 0 = weightless
			var caseTopPlane = new Physijs.BoxMesh(new THREE.CubeGeometry(caseWidth, caseThickness, caseDepth), caseMaterial, 0); //Gravity, 0 = weightless
			var caseVisibleSidePlane = new Physijs.BoxMesh(new THREE.CubeGeometry(caseThickness, caseHeight, caseDepth), caseMaterial, 0); //Gravity, 0 = weightless
			var caseInvisibleSidePlane = new Physijs.BoxMesh(new THREE.CubeGeometry(caseThickness, caseHeight, caseDepth), transparentMaterial, 0); //Gravity, 0 = weightless
			var caseBackPlane = new Physijs.BoxMesh(new THREE.CubeGeometry(caseWidth, caseHeight, caseThickness), caseMaterial, 0); //Gravity, 0 = weightless
			var caseFrontPlane = new Physijs.BoxMesh(new THREE.CubeGeometry(caseWidth, caseHeight, caseThickness), caseMaterial, 0); //Gravity, 0 = weightless

			caseBottomPlane.position.set(0, 0, 0);

			caseTopPlane.position.set(0, caseHeight, 0);

			caseVisibleSidePlane.position.set(-caseWidth/2, caseHeight/2, 0);

			caseInvisibleSidePlane.position.set(caseWidth/2, caseHeight/2, 0);

			caseBackPlane.position.set(0, caseHeight/2, caseDepth/2);

			caseFrontPlane.position.set(0, caseHeight/2, -caseDepth/2);

			caseInvisibleSidePlane.isInvisible = true; //Set invisible marker
			caseVisibleSidePlane.isInvisible = false;
			caseBottomPlane.isInvisible = false;
			caseTopPlane.isInvisible = false;
			caseBackPlane.isInvisible = false;
			caseFrontPlane.isInvisible = false;

			scene.add(caseBottomPlane);
			scene.add(caseTopPlane);
			scene.add(caseVisibleSidePlane);
			scene.add(caseInvisibleSidePlane);
			scene.add(caseBackPlane);
			scene.add(caseFrontPlane);

			scope.caseGroup.bottomPlane = caseBottomPlane;
			scope.caseGroup.topPlane = caseTopPlane;
			scope.caseGroup.visibleSidePlane = caseVisibleSidePlane;
			scope.caseGroup.invisibleSidePlane = caseInvisibleSidePlane;
			scope.caseGroup.backPlane = caseBackPlane;
			scope.caseGroup.frontPlane = caseFrontPlane;

			scope.caseGroup.bottomPlane.positionCode = positionsEnum.BOTTOM;
			scope.caseGroup.topPlane.positionCode = positionsEnum.TOP;
			scope.caseGroup.visibleSidePlane.positionCode = positionsEnum.VISIBLE_SIDE;
			scope.caseGroup.invisibleSidePlane.positionCode = positionsEnum.INVISIBLE_SIDE;
			scope.caseGroup.backPlane.positionCode = positionsEnum.BACK;
			scope.caseGroup.frontPlane.positionCode = positionsEnum.FRONT;

			scope.caseGroup.bottomPlane.dimensions = new Object();
			scope.caseGroup.topPlane.dimensions = new Object();
			scope.caseGroup.visibleSidePlane.dimensions = new Object();
			scope.caseGroup.invisibleSidePlane.dimensions = new Object();
			scope.caseGroup.backPlane.dimensions = new Object();
			scope.caseGroup.frontPlane.dimensions = new Object();

			scope.caseGroup.bottomPlane.dimensions.width = caseWidth;
			scope.caseGroup.bottomPlane.dimensions.height = caseDepth;

			scope.caseGroup.topPlane.dimensions.width = caseWidth;
			scope.caseGroup.topPlane.dimensions.height = caseDepth;

			scope.caseGroup.visibleSidePlane.dimensions.width = caseDepth;
			scope.caseGroup.visibleSidePlane.dimensions.height = caseHeight;

			scope.caseGroup.invisibleSidePlane.dimensions.width = caseDepth;
			scope.caseGroup.invisibleSidePlane.dimensions.height = caseHeight;

			scope.caseGroup.backPlane.dimensions.width = caseWidth;
			scope.caseGroup.backPlane.dimensions.height = caseHeight;

			scope.caseGroup.frontPlane.dimensions.width = caseWidth;
			scope.caseGroup.frontPlane.dimensions.height = caseHeight;
		}

		/*Creates a new composite fan object consisting of a fanPhysicalObject, a fanAOEObject, and properties
		  fan = The object containing the properties that will be used to create a new fan e.g. size, RPM etc.*/
		scope.createFan = function(fan) {
			/*A fan is made up a of a fanObject with two sub-objects, a fanAOEObject representing the area of effect for a fan
			and the fanPhysicalObject, which is the physical fan the user sees*/

 			var fanAOEObject = scope.createFanAOEObject(fan, true);

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//

			var fColor;

			if (fan.properties.active === true) {
				fColor = parseInt(scope.fanColors.normal)
			} else {
				fColor = parseInt(scope.fanColors.inactive)
			}

			var fanPhysicalMaterial = Physijs.createMaterial(
				new THREE.MeshLambertMaterial({
					color: fColor,
					side: fan.fanObject.material.side
				}),
				0.3,
				1
			);


			var fanPhysicalObject = new Physijs.BoxMesh(new THREE.CubeGeometry(fan.fanObject.dimensions.width, fan.fanObject.dimensions.height, fan.fanObject.dimensions.depth), fanPhysicalMaterial, 0); //Gravity, 0 = weightless

			//We need to rotate the fanAOEObject (and possibly fanPhysicalObject) in order for them to "point" inside the case
			switch(fan.properties.position) {
				case positionsEnum.FRONT:
					fanAOEObject.rotation.x = 90 * Math.PI/180;
					break;
				case positionsEnum.BACK:
					fanAOEObject.rotation.x = 90 * Math.PI/180;
					break;
				case positionsEnum.TOP:
					fanPhysicalObject.rotation.x = 90 * Math.PI/180;
					fanAOEObject.rotation.x = 180 * Math.PI/180;
					break;
				case positionsEnum.BOTTOM:
					fanPhysicalObject.rotation.x = 90 * Math.PI/180;
					fanAOEObject.rotation.x = 180 * Math.PI/180;
					break;
				case positionsEnum.VISIBLE_SIDE:
					fanPhysicalObject.rotation.y = 90 * Math.PI/180;
					fanAOEObject.rotation.z = 90 * Math.PI/180;
					break;
				case positionsEnum.INVISIBLE_SIDE:
					fanPhysicalObject.rotation.y = 90 * Math.PI/180;
					fanAOEObject.rotation.z = 90 * Math.PI/180;
					break;
			}

			fanPhysicalObject.position.set(fan.position.x, fan.position.y, fan.position.z);

			fanPhysicalObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//

			var fanObject = new Object();

			fanObject.properties = new Object();

			fanObject.fanAOEObject = fanAOEObject;
			fanObject.fanAOEObject.dimensions = fan.fanAOEObject.dimensions;
			fanObject.fanPhysicalObject = fanPhysicalObject;
			fanObject.fanPhysicalObject.dimensions = fan.fanObject.dimensions;
			fanObject.id = fanPhysicalObject.id;
			fanObject.editing = false;
			fanObject.properties.mode = fan.properties.mode;
			fanObject.properties.size = fan.properties.size;
			fanObject.properties.maxRPM = fan.properties.maxRPM;
			fanObject.properties.percentageRPM = fan.properties.percentageRPM;
			fanObject.properties.position = fan.properties.position;
			fanObject.AOEWireframe = new THREE.EdgesHelper(fanAOEObject, parseInt(scope.fanColors.wireframe));
			fanObject.properties.dateCreated = scope.getCurrentDate();
			fanObject.properties.dateModified = scope.getCurrentDate();
			fanObject.properties.active = fan.properties.active;
			fanObject.properties.isValidPos = true;

			scope.determineFanAOEPosition(fanObject);

			scene.add(fanPhysicalObject);

			scene.add(fanAOEObject);

			//Calculate force
			//fanObject.forceVector = new THREE.Vector3(fan.properties.forceVector.x, fan.properties.forceVector.y, fan.properties.forceVector.z);
			fanObject.properties.forceVector =  scope.calculateForceVector(fanObject);

			//Checking param mode here to offset positions
			//TODO: Add support for fans that are neither intake or exhaust (e.g. GPU fan)
			if (fan.properties.mode != "exhaust") {
				scope.intakeFans.push(fanObject);
			} else {
				scope.exhaustFans.push(fanObject);
			}

			scope.fans.push(fanObject);	
		}

		/*Creates a new composite fan object consisting of a fanPhysicalObject, a fanAOEObject, and properties. This will create 
		  a fan using values loaded from a project file. This should only be used by the loadProject() function*/
		scope.loadFan = function(fan) {
			/*A fan is made up a of a fanObject with two sub-objects, a fanAOEObject representing the area of effect for a fan
			and the fanPhysicalObject, which is the physical fan the user sees*/
			//Only fans loaded from a project file should be created using this function

			fan.fanAOEObject = scope.defaultNewFanAOE;

 			var fanAOEObject = scope.createFanAOEObject(fan, false);

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//
			var fColor;

			if (fan.properties.active === true) {
				fColor = parseInt(scope.fanColors.normal)
			} else {
				fColor = parseInt(scope.fanColors.inactive)
			}

			var fanPhysicalMaterial = Physijs.createMaterial(
				new THREE.MeshLambertMaterial({
					color: fColor,
					side: THREE.DoubleSide
				}),
				0.3,
				1
			);


			var fanPhysicalObject = new Physijs.BoxMesh(new THREE.CubeGeometry(fan.dimensions.width, fan.dimensions.height, fan.dimensions.depth), fanPhysicalMaterial, 0); //Gravity, 0 = weightless

			//We need to rotate the fanAOEObject (and possibly fanPhysicalObject) in order for them to "point" inside the case
			switch(fan.properties.position) {
				case positionsEnum.FRONT:
					fanAOEObject.rotation.x = 90 * Math.PI/180;
					break;
				case positionsEnum.BACK:
					fanAOEObject.rotation.x = 90 * Math.PI/180;
					break;
				case positionsEnum.TOP:
					fanPhysicalObject.rotation.x = 90 * Math.PI/180;
					fanAOEObject.rotation.x = 180 * Math.PI/180;
					break;
				case positionsEnum.BOTTOM:
					fanPhysicalObject.rotation.x = 90 * Math.PI/180;
					fanAOEObject.rotation.x = 180 * Math.PI/180;
					break;
				case positionsEnum.VISIBLE_SIDE:
					fanPhysicalObject.rotation.y = 90 * Math.PI/180;
					fanAOEObject.rotation.z = 90 * Math.PI/180;
					break;
				case positionsEnum.INVISIBLE_SIDE:
					fanPhysicalObject.rotation.y = 90 * Math.PI/180;
					fanAOEObject.rotation.z = 90 * Math.PI/180;
					break;
			}

			fanPhysicalObject.position.set(fan.x, fan.y, fan.z);

			fanPhysicalObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//

			var fanObject = new Object();

			fanObject.properties = new Object();

			fanObject.fanAOEObject = fanAOEObject;
			fanObject.fanAOEObject.dimensions = fan.fanAOEObject.dimensions;
			fanObject.fanPhysicalObject = fanPhysicalObject;
			fanObject.fanPhysicalObject.dimensions = fan.dimensions;
			fanObject.id = fanPhysicalObject.id;
			fanObject.editing = false;
			fanObject.properties.mode = fan.properties.mode;
			fanObject.properties.size = fan.properties.size;
			fanObject.properties.maxRPM = fan.properties.maxRPM;
			fanObject.properties.percentageRPM = fan.properties.percentageRPM;
			fanObject.properties.position = fan.properties.position;
			fanObject.AOEWireframe = new THREE.EdgesHelper(fanAOEObject, parseInt(scope.fanColors.wireframe));
			fanObject.properties.dateCreated = fan.properties.dateCreated;
			fanObject.properties.dateModified = fan.properties.dateModified;
			fanObject.properties.active = fan.properties.active;
			fanObject.properties.isValidPos = true;

			scope.determineFanAOEPosition(fanObject);

			scene.add(fanPhysicalObject);

			scene.add(fanAOEObject);

			//Calculate force
			//fanObject.forceVector = new THREE.Vector3(fan.properties.forceVector.x, fan.properties.forceVector.y, fan.properties.forceVector.z);
			fanObject.properties.forceVector =  scope.calculateForceVector(fanObject);

			//Checking param mode here to offset positions
			//TODO: Add support for fans that are neither intake or exhaust (e.g. GPU fan)
			if (fan.properties.mode != "exhaust") {
				scope.intakeFans.push(fanObject);
			} else {
				scope.exhaustFans.push(fanObject);
			}

			scope.fans.push(fanObject);	
		}

		/*Creates a new composite fan object consisting of a fanPhysicalObject, a fanAOEObject, and properties*/
		scope.createNewFan = function() {
			//Create a new fan using default properties from newFanDefaults.json
			//Much the same as scope.createFan

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//
			var fanPhysicalMaterial = Physijs.createMaterial(
				new THREE.MeshLambertMaterial({
					color: parseInt(scope.fanColors.normal),
					side: scope.defaultNewFan.fanObject.material.side
				}),
				0.3,
				1
			);

			var fanPhysicalObject = new Physijs.BoxMesh(new THREE.CubeGeometry(scope.defaultNewFan.fanObject.dimensions.width, scope.defaultNewFan.fanObject.dimensions.height, scope.defaultNewFan.fanObject.dimensions.depth), fanPhysicalMaterial, 0); //Gravity, 0 = weightless

			var fanAOEObject = scope.createFanAOEObject(scope.defaultNewFan, true);

			//We need to rotate the fanAOEObject (and possibly fanPhysicalObject) in order for them to "point" inside the case
			switch(scope.newFanPlaceholderObjectPosition) {
				case positionsEnum.FRONT:
					fanAOEObject.rotation.x = 90 * Math.PI/180;
					break;
				case positionsEnum.BACK:
					fanAOEObject.rotation.x = 90 * Math.PI/180;
					break;
				case positionsEnum.TOP:
					fanPhysicalObject.rotation.x = 90 * Math.PI/180;
					fanAOEObject.rotation.x = 180 * Math.PI/180;
					break;
				case positionsEnum.BOTTOM:
					fanPhysicalObject.rotation.x = 90 * Math.PI/180;
					fanAOEObject.rotation.x = 180 * Math.PI/180;
					break;
				case positionsEnum.VISIBLE_SIDE:
					fanPhysicalObject.rotation.y = 90 * Math.PI/180;
					fanAOEObject.rotation.z = 90 * Math.PI/180;
					break;
				case positionsEnum.INVISIBLE_SIDE:
					fanPhysicalObject.rotation.y = 90 * Math.PI/180;
					fanAOEObject.rotation.z = 90 * Math.PI/180;
					break;
			}

			fanPhysicalObject.position.set(scope.newFanPlaceholderObject.position.x, scope.newFanPlaceholderObject.position.y, scope.newFanPlaceholderObject.position.z);

			fanPhysicalObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//

			var fanObject = new Object();

			fanObject.properties = new Object();

			fanObject.fanAOEObject = fanAOEObject;
			fanObject.fanAOEObject.dimensions = scope.defaultNewFan.fanAOEObject.dimensions;
			fanObject.fanPhysicalObject = fanPhysicalObject;
			fanObject.fanPhysicalObject.dimensions = scope.defaultNewFan.fanObject.dimensions;
			fanObject.id = fanPhysicalObject.id;
			fanObject.editing = false;
			fanObject.properties.mode = scope.defaultNewFan.properties.mode;
			fanObject.properties.size = scope.defaultNewFan.properties.size;
			fanObject.properties.maxRPM = scope.defaultNewFan.properties.maxRPM;
			fanObject.properties.percentageRPM = scope.defaultNewFan.properties.percentageRPM;
			fanObject.properties.position = scope.newFanPlaceholderObjectPosition;
			fanObject.AOEWireframe = new THREE.EdgesHelper(fanAOEObject, parseInt(scope.fanColors.wireframe));
			fanObject.properties.dateCreated = scope.getCurrentDate();
			fanObject.properties.active = true;
			fanObject.properties.dateModified = scope.getCurrentDate();

			scope.determineFanAOEPosition(fanObject);

			scene.add(fanPhysicalObject);

			scene.add(fanAOEObject);

			//Calculate force
			//fanObject.forceVector = new THREE.Vector3(fan.properties.forceVector.x, fan.properties.forceVector.y, fan.properties.forceVector.z);
			fanObject.properties.forceVector =  scope.calculateForceVector(fanObject);

			//Checking param mode here to offset positions
			//TODO: Add support for fans that are neither intake or exhaust (e.g. GPU fan)
			if (scope.defaultNewFan.properties.mode != "exhaust") {
				scope.intakeFans.push(fanObject);
			} else {
				scope.exhaustFans.push(fanObject);
			}

			scope.fans.push(fanObject);	
			scope.projectDetails.dateModified = scope.getCurrentDate();
		}

		/*Creates a new fanAOEObject for a given fan
		  fan = The fan composite object which the fanAOEObject will be a part of
		  defaultCreation = If the fan we are creating a fanAOEObject for uses default fan property values, set this to true to create a fanAOEObject using default values*/
		scope.createFanAOEObject = function(fan, defaultCreation) {
			var fanAOEMaterial = Physijs.createMaterial(
				new THREE.MeshLambertMaterial({
					opacity: fan.fanAOEObject.material.opacity,
				    color: parseInt(scope.fanColors.normal),
				    transparent: fan.fanAOEObject.material.transparent,
				    side: fan.fanAOEObject.material.side
				}),
				0.3,
				1
			);

			//Determine height at max usage
			var maxHeight = ((fan.properties.size * fan.properties.maxRPM) * fan.properties.percentageRPM/100000)/2;

			if (maxHeight > 180) {
				maxHeight = 180;
			}

			//Height changes depending on the percentageRPM defined
			fan.fanAOEObject.dimensions.height = maxHeight * (fan.properties.percentageRPM/100);

			if (defaultCreation == true) {
				var fanAOEObject = new Physijs.CylinderMesh(new THREE.CylinderGeometry(fan.fanAOEObject.dimensions.radiusTop, fan.fanAOEObject.dimensions.radiusBottom, fan.fanAOEObject.dimensions.height, fan.fanAOEObject.dimensions.radiusSegments, fan.fanAOEObject.dimensions.heightSegments), fanAOEMaterial, 0); //Gravity, 0 = weightless
			} else {
				var fanAOEObject = new Physijs.CylinderMesh(new THREE.CylinderGeometry((fan.properties.size/2), (fan.properties.size/2), fan.fanAOEObject.dimensions.height, fan.fanAOEObject.dimensions.radiusSegments, fan.fanAOEObject.dimensions.heightSegments), fanAOEMaterial, 0); //Gravity, 0 = weightless
			}

			fanAOEObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it
			return fanAOEObject;
		}

		/*Calculates the force vector in terms of (x,y,z) values for a given fan
		  fan = The fan to calculate the force vector for*/
		scope.calculateForceVector = function(fan) {

			if (fan.properties.active === true) {
				var maxForce = ((fan.properties.size * 5000) + (fan.properties.maxRPM * 100));

				var realForce = (fan.properties.percentageRPM/1000)*maxForce;

				if (realForce > 300000) { realForce = 300000 }; //Max value is a magic number, will be explained why in documentation
			} else {
				var realForce = 0;
			}

			//determine which axis to apply force depending on fan.properties.mode and fan.properties.position
			//What about fans which aren't intake/exhaust?
			switch(fan.properties.position) {
				case positionsEnum.FRONT:
					//Z axis
					if (fan.properties.mode == "intake") {
						return new THREE.Vector3(0,0,realForce);
					} else if (fan.properties.mode == "exhaust") {
						return new THREE.Vector3(0,0,-realForce);
					}
					break;
				case positionsEnum.BACK:
					//Z axis
					if (fan.properties.mode == "intake") {
						return new THREE.Vector3(0,0,-realForce);
					} else if (fan.properties.mode == "exhaust") {
						return new THREE.Vector3(0,0,realForce);
					}
					break;
				case positionsEnum.TOP:
					//Y axis
					if (fan.properties.mode == "intake") {
						return new THREE.Vector3(0,-realForce,0);
					} else if (fan.properties.mode == "exhaust") {
						return new THREE.Vector3(0,realForce,0);
					}
					break;
				case positionsEnum.BOTTOM:
					//Y axis
					if (fan.properties.mode == "intake") {
						return new THREE.Vector3(0,realForce,0);
					} else if (fan.properties.mode == "exhaust") {
						return new THREE.Vector3(0,-realForce,0);
					}
					break;
				case positionsEnum.VISIBLE_SIDE:
					//X axis
					if (fan.properties.mode == "intake") {
						return new THREE.Vector3(realForce,0,0);
					} else if (fan.properties.mode == "exhaust") {
						return new THREE.Vector3(-realForce,0,0);
					}
					break;
				case positionsEnum.INVISIBLE_SIDE:
					//X axis
					if (fan.properties.mode == "intake") {
						return new THREE.Vector3(-realForce,0,0);
					} else if (fan.properties.mode == "exhaust") {
						return new THREE.Vector3(realForce,0,0);
					}
					break;
			}
		}

		/*Recreates a fan object with the new size whenever size changes
		  fan = The fan being resized*/
		scope.resizeFan = function(fan) {
			//We can't resize objects with physijs, so we have to create a new fan whenever we resize

			var resizedFan = fan;
			resizedFan.fanObject = resizedFan.fanPhysicalObject;
			resizedFan.fanObject.dimensions.width = resizedFan.properties.size;
			resizedFan.fanObject.dimensions.height = resizedFan.properties.size;
			resizedFan.fanAOEObject.dimensions.radiusTop = resizedFan.properties.size/2;
			resizedFan.fanAOEObject.dimensions.radiusBottom = resizedFan.properties.size/2;
			resizedFan.position = resizedFan.fanPhysicalObject.position;

			scope.createFan(resizedFan);

			var length = scope.fans.length;

			var index = 0;

			scope.editFan = scope.fans[length-1];

			scope.editFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.validEdit));
			scope.editFan.editing = true;
			scene.add(scope.editFan.AOEWireframe);

			if (fan.properties.mode === "intake") {
				index = scope.intakeFans.indexOf(fan);
				scope.intakeFans.splice(index, 1);
			} else {
				index = scope.exhaustFans.indexOf(fan);
				scope.exhaustFans.splice(index, 1);
			}

			index = scope.fans.indexOf(fan);
			scope.fans.splice(index, 1);

			scene.remove(fan.fanPhysicalObject);
			scene.remove(fan.fanAOEObject);
			scene.remove(fan.AOEWireframe);
		}

		/*Handles particle to fan collisions. If a particle collides with an exhaust fan fanPhysicalObject, remove the particle from the scene and recycle it.
		  If a particle collides with a fan fanAOEObject, then apply the fans force to the particle*/
		function handleParticleToFanCollision(collided_with, linearVelocity, angularVelocity) {
			//Event gets called when physics objects (spheres) collide with another object

			for (var i = 0; i < scope.fans.length; i++) {
				if (collided_with.id === scope.fans[i].fanPhysicalObject.id && scope.fans[i].properties.mode === "exhaust" && scope.fans[i].properties.active === true) {
					//Collided with active exhuast fanPhysicalObject, delete the particle
					for (var j = 0; j < particles.length; j++) {
						if (particles[j].id === this.id) {
							scope.recycleParticle(particles[j]);
							scope.stats.removedParticles += 1;
							scope.stats.activeParticles -= 1;
							scope.$digest();
							break;
						}
					}
					break;
				}
				if (collided_with.id === scope.fans[i].fanAOEObject.id) {
					//Collided with fanAOEObject, apply suitable force
					this.applyCentralImpulse(scope.fans[i].properties.forceVector);
					break;
				} 
			}
		}

		/*Handles mouse move events. If we are adding or dragging a fan, then we update it's position/rotation here*/
		function handleMouseMove(event) {			
			if (scope.dragFan != null) {
				var touchSide = detectTouchingCase(event);
				var position = null;

				if (touchSide != null) {
					switch(touchSide) {
						case scope.caseGroup.bottomPlane:
							position = positionsEnum.BOTTOM;
							scope.dragFan.properties.position = positionsEnum.BOTTOM;
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.x = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 180 * Math.PI/180;
							scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
							scope.dragFan.fanAOEObject.__dirtyRotation = true;
							break;
						case scope.caseGroup.topPlane:
							position = positionsEnum.TOP;
							scope.dragFan.properties.position = positionsEnum.TOP;
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.x = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 180 * Math.PI/180;
							scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
							scope.dragFan.fanAOEObject.__dirtyRotation = true;
							break;
						case scope.caseGroup.visibleSidePlane:
							position = positionsEnum.VISIBLE_SIDE;
							scope.dragFan.properties.position = positionsEnum.VISIBLE_SIDE;
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.z = 90 * Math.PI/180;
							scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
							scope.dragFan.fanAOEObject.__dirtyRotation = true;
							break;
						case scope.caseGroup.invisibleSidePlane:
							position = positionsEnum.INVISIBLE_SIDE;
							scope.dragFan.properties.position = positionsEnum.INVISIBLE_SIDE;
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.z = 90 * Math.PI/180;
							scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
							scope.dragFan.fanAOEObject.__dirtyRotation = true;
							break;
						case scope.caseGroup.backPlane:
							position = positionsEnum.BACK;
							scope.dragFan.properties.position = positionsEnum.BACK;
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 90 * Math.PI/180;
							scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
							scope.dragFan.fanAOEObject.__dirtyRotation = true;
							break;
						case scope.caseGroup.frontPlane:
							position = positionsEnum.FRONT;
							scope.dragFan.properties.position = positionsEnum.FRONT;
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 90 * Math.PI/180;
							scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
							scope.dragFan.fanAOEObject.__dirtyRotation = true;
							break;
					}

					if (scope.dragFan.properties.position != null) {
						var dragSide = scope.chooseSide(event, scope.dragFan.properties.position);

						if (dragSide.intersects.length > 0) {
							scope.dragFan.fanPhysicalObject.position.copy(dragSide.intersects[0].point);							
							scope.isValidFanPosition(scope.dragFan, position);							
							scope.determineFanAOEPosition(scope.dragFan);
							scope.dragFan.fanAOEObject.__dirtyPosition = true;
							scope.dragFan.fanPhysicalObject.__dirtyPosition = true;
							scope.dragFan.properties.forceVector = scope.calculateForceVector(scope.dragFan);
							scope.projectDetails.dateModified = scope.getCurrentDate();
							scope.editFan.properties.dateModified = scope.getCurrentDate();
							scope.$digest();
						}
					}
				}


			} else if (scope.addingFan === true) {
				
				var touchSide = detectTouchingCase(event);

				switch(touchSide) {
					case scope.caseGroup.bottomPlane:
						scope.newFanPlaceholderObjectPosition = positionsEnum.BOTTOM;
						scope.newFanPlaceholderObject.rotation.x = 0;
						scope.newFanPlaceholderObject.rotation.y = 0;
						scope.newFanPlaceholderObject.rotation.x = 90 * Math.PI/180;
						scope.newFanPlaceholderObject.__dirtyRotation = true;
						position = positionsEnum.BOTTOM;
						break;
					case scope.caseGroup.topPlane:
						scope.newFanPlaceholderObjectPosition= positionsEnum.TOP;
						scope.newFanPlaceholderObject.rotation.x = 0;
						scope.newFanPlaceholderObject.rotation.y = 0;
						scope.newFanPlaceholderObject.rotation.x = 90 * Math.PI/180;
						scope.newFanPlaceholderObject.__dirtyRotation = true;
						position = positionsEnum.TOP;
						break;
					case scope.caseGroup.visibleSidePlane:
						scope.newFanPlaceholderObjectPosition = positionsEnum.VISIBLE_SIDE;
						scope.newFanPlaceholderObject.rotation.x = 0;
						scope.newFanPlaceholderObject.rotation.y = 0;
						scope.newFanPlaceholderObject.rotation.y = 90 * Math.PI/180;
						scope.newFanPlaceholderObject.__dirtyRotation = true;
						position = positionsEnum.VISIBLE_SIDE;
						break;
					case scope.caseGroup.invisibleSidePlane:
						scope.newFanPlaceholderObjectPosition = positionsEnum.INVISIBLE_SIDE;
						scope.newFanPlaceholderObject.rotation.x = 0;
						scope.newFanPlaceholderObject.rotation.y = 0;
						scope.newFanPlaceholderObject.rotation.y = 90 * Math.PI/180;
						scope.newFanPlaceholderObject.__dirtyRotation = true;
						position = positionsEnum.INVISIBLE_SIDE;
						break;
					case scope.caseGroup.backPlane:
						scope.newFanPlaceholderObjectPosition = positionsEnum.BACK;
						scope.newFanPlaceholderObject.rotation.x = 0;
						scope.newFanPlaceholderObject.rotation.y = 0;
						scope.newFanPlaceholderObject.__dirtyRotation = true;
						position = positionsEnum.BACK;
						break;
					case scope.caseGroup.frontPlane:
						scope.newFanPlaceholderObjectPosition = positionsEnum.FRONT;
						scope.newFanPlaceholderObject.rotation.x = 0;
						scope.newFanPlaceholderObject.rotation.y = 0;
						scope.newFanPlaceholderObject.__dirtyRotation = true;
						position = positionsEnum.FRONT;
						break;
				}

				if (scope.newFanPlaceholderObjectPosition != null) {
					var dragSide = scope.chooseSide(event, scope.newFanPlaceholderObjectPosition);

					if (dragSide.intersects != undefined) {
							if (dragSide.intersects.length > 0) {
							scope.newFanPlaceholderObject.position.copy(dragSide.intersects[0].point);

							scope.isValidFanPosition(scope.newFanPlaceholderObject, position);	

							scope.newFanPlaceholderObject.__dirtyPosition = true;

							scope.$digest();
						}
					}
				}


			} else {
				//When a user hovers on a fan change fan color to hover state only if we are NOT editing that fan 

				var touchFan = detectTouchingFan(event);

				//For peace of mind, reset all fans not being edited to normal fan color
				for (var i = 0; i < scope.fans.length; i++) {
					if (scope.fans[i].editing == false) {
						if (scope.fans[i].properties.active === true) {
							scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.normal));
						} else {
							scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.inactive));
						}
					}
				}

				if (touchFan) {
					//Only change to hover color when we are NOT editing the current fan
					if (touchFan.editing == false) {
						touchFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.highlight));
					}				
				}
			}
		}

		/*Handles user mouse clicks. If we are adding a fan, this will create a new fan object at the mouse location.
		  If we click on an existing fan, then start editing that fan. If we are dragging a fan, then release the dragged fan
		  at the current mouse location*/
		function handleMouseClick(event) {
			if (scope.addingFan === true) {
				orbitControl.enableRotate = false;
				if (scope.addingFanValidPos === true) {
					scope.createNewFan();
					scene.remove(scope.newFanPlaceholderObject);
					scene.remove(scope.newFanPlaceholderWireframe);
					scope.addingFan = false;
					scope.addingFanValidPos = false;
				    scope.newFanPlaceholderObject = null;
				    scope.newFanPlaceholderWireframe = null;
				    orbitControl.enableRotate = true;
				}
			} else {
				orbitControl.enableRotate = true;
			}		

			//When a user clicks on a fan, open the component control panel section and change fan color
			var touchFan = detectTouchingFan(event);

			scope.editFan = null;
			scope.dragFan = null;
			scope.$digest();

			//For peace of mind, reset all fans to not editing when we click
			for (var i = 0; i < scope.fans.length; i++) {
				scope.fans[i].editing = false;
				if (scope.fans[i].properties.active === true) {
					scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.normal));
				} else {
					scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.inactive));
				}
				scene.remove(scope.fans[i].AOEWireframe);
				document.getElementById("componentForm").setAttribute("aria-disabled", true); 
			}

			//If we clicked on a fan, do stuff here
			if (touchFan && scope.addingFan != true) {
				touchFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.validEdit));
				touchFan.editing = true;
				scene.add(touchFan.AOEWireframe);
				scope.editFan = touchFan;
				scope.dragFan = touchFan;
				scope.originalFanPos.x = touchFan.fanPhysicalObject.position.x;
				scope.originalFanPos.y = touchFan.fanPhysicalObject.position.y;
				scope.originalFanPos.z = touchFan.fanPhysicalObject.position.z;
				scope.originalFanPos.position = touchFan.properties.position;
				scope.$digest();
				document.getElementById("componentForm").setAttribute("aria-disabled", false); 
				orbitControl.enableRotate = false;
			}

			//If we are dragging a fan, do stuff here
			if (scope.dragFan != null && scope.addingFan != true) {				
				var dragSide = scope.chooseSide(event, scope.dragFan.properties.position);

				if (dragSide.intersects.length > 0) {
					offset.copy(dragSide.intersects[0].point).sub(dragSide.tempPlane.position);
				}
			}
		}

		/*Handles what happens when a user releases a mouse click. If a fan is being dragged and
		  is in a valid position, then stop dragging the fan. If it is in an invalid position, then
		  move it back to it's original position (before the user started dragging it)*/
		function handleMouseRelease(event) {
			if (scope.dragFan != null) {
				if (scope.dragFan.properties.isValidPos == true) {
					scope.dragFan = null;
					scope.$digest();	
				} else {;
					scope.dragFan.fanPhysicalObject.position.set(scope.originalFanPos.x, scope.originalFanPos.y, scope.originalFanPos.z);
					scope.dragFan.properties.position = scope.originalFanPos.position;
					switch(scope.dragFan.properties.position) {
						case positionsEnum.FRONT:
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 90 * Math.PI/180;
							break;
						case positionsEnum.BACK:
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 90 * Math.PI/180;
							break;
						case positionsEnum.TOP:
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.x = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 180 * Math.PI/180;
							break;
						case positionsEnum.BOTTOM:
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.x = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.x = 180 * Math.PI/180;
							break;
						case positionsEnum.VISIBLE_SIDE:
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.z = 90 * Math.PI/180;
							break;
						case positionsEnum.INVISIBLE_SIDE:
							scope.dragFan.fanPhysicalObject.rotation.x = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 0;
							scope.dragFan.fanPhysicalObject.rotation.y = 90 * Math.PI/180;
							scope.dragFan.fanAOEObject.rotation.x = 0;
							scope.dragFan.fanAOEObject.rotation.y = 0;
							scope.dragFan.fanAOEObject.rotation.z = 0;
							scope.dragFan.fanAOEObject.rotation.z = 90 * Math.PI/180;
							break;
					}
					scope.dragFan.fanPhysicalObject.__dirtyRotation = true;
					scope.dragFan.fanPhysicalObject.__dirtyPosition = true;
					scope.dragFan.fanAOEObject.__dirtyRotation = true;
					scope.$digest();
					for (var i = 0; i < scope.fans.length; i++) {
						scope.fans[i].editing = false;
						if (scope.fans[i].properties.active === true) {
							scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.normal));
						} else {
							scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.inactive));
						}
						scene.remove(scope.fans[i].AOEWireframe); 
					}
					scope.determineFanAOEPosition();
					scope.dragFan.fanAOEObject.__dirtyPosition = true;
					scope.dragFan.properties.isValidPos = true;
					scope.dragFan.properties.forceVector = scope.calculateForceVector(scope.dragFan);
					scope.editFan = null;
					scope.dragFan = null;
					scope.$digest();					
				}
			}
		}

		/*Deleates a fan from the 3D scene and from the list of fans*/
		scope.deleteFan = function() {
			if (scope.fans.length > 1) {
				scope.editFan.editing = false;

				scene.remove(scope.editFan.fanPhysicalObject);
				scene.remove(scope.editFan.fanAOEObject);
				scene.remove(scope.editFan.AOEWireframe);

				if (scope.editFan.properties.mode === "intake") {
					var index = scope.intakeFans.indexOf(scope.editFan);
					scope.intakeFans.splice(index, 1);
				} else if (scope.editFan.properties.mode === "exhaust") {
					var index = scope.exhaustFans.indexOf(scope.editFan);
					scope.exhaustFans.splice(index, 1);
				}

				var index = scope.fans.indexOf(scope.editFan);
				scope.fans.splice(index, 1);
				
				//Angular doesn't play nice setting scope.editFan to null here, this is a workaround
				scope.editFan = [];
				scope.dragFan = null;

				scope.projectDetails.dateModified = scope.getCurrentDate();
			}
		}

		/*Creates a placeholder fan object that follows the users mouse so the user can decide where to place the fan*/
		scope.addNewFan = function() {

			scope.editFan = null;
			scope.dragFan = null;

			//For peace of mind, reset all fans to not editing when we click
			for (var i = 0; i < scope.fans.length; i++) {
				scope.fans[i].editing = false;
				scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.normal));
				scene.remove(scope.fans[i].AOEWireframe); 
			}

			var fanPhysicalMaterial = Physijs.createMaterial(
				new THREE.MeshLambertMaterial({
					color: parseInt(scope.fanColors.normal),
					opacity: 0,
					transparent: true,
					side: THREE.DoubleSide
				}),
				0.3,
				1
			);

			//Create placeholder fan objects
			scope.newFanPlaceholderObject = new Physijs.BoxMesh(new THREE.CubeGeometry(120, 120, 40), fanPhysicalMaterial, 0); //Gravity, 0 = weightless
			scope.newFanPlaceholderWireframe = new THREE.EdgesHelper(scope.newFanPlaceholderObject, parseInt(scope.fanColors.validEdit));
			scope.newFanPlaceholderObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it
			scope.addingFanValidPos = true;

			//Add them to the scene
			scope.newFanPlaceholderObject.position.set(0, 300, -248);
			scene.add(scope.newFanPlaceholderObject);
			scene.add(scope.newFanPlaceholderWireframe);

			scope.addingFan = true;
		
		}

		/*Cancels the add fan operation*/
		scope.cancelAddingFan = function() {
			scope.editFan = null;
			scope.dragFan = null;
			scope.addingFan = false;
			scope.addingFanValidPos = false;
			scene.remove(scope.newFanPlaceholderObject);
			scene.remove(scope.newFanPlaceholderWireframe);
			scope.newFanPlaceholderObject = new Object();
    		scope.newFanPlaceholderWireframe = null;
		}

		/**Determines what side of the case a fan is being dragged on*/
		scope.chooseSide = function(event, position) {			

			//Have to normalise these coords so that they are between -1 and 1
			var mouseX = (((event.clientX - document.getElementById('tabbedPaneContainer').offsetWidth) / width) * 2 - 1); //Have to minus the tabbedPaneContainer width because otherwise it would be included in the normalising to get X in terms of the canvas
			var mouseY = - (event.clientY / height) * 2 + 1;

			//Get 3D vector from 3D mouse position using unproject function
			var vector  = new THREE.Vector3(mouseX, mouseY, 1);
			vector.unproject(camera);

			var dragRaycaster = new THREE.Raycaster();
			dragRaycaster.set(camera.position, vector.sub(camera.position).normalize());

			switch(position) {
				case positionsEnum.FRONT:
					var intersects = dragRaycaster.intersectObject(scope.caseGroup.frontPlane);
					var tempPlane = scope.caseGroup.frontPlane;
					break;
				case positionsEnum.BACK:
					var intersects = dragRaycaster.intersectObject(scope.caseGroup.backPlane);
					var tempPlane = scope.caseGroup.backPlane;
					break;
				case positionsEnum.TOP:
					var intersects = dragRaycaster.intersectObject(scope.caseGroup.topPlane);
					var tempPlane = scope.caseGroup.topPlane;
					break;
				case positionsEnum.BOTTOM:
					var intersects = dragRaycaster.intersectObject(scope.caseGroup.bottomPlane);
					var tempPlane = scope.caseGroup.bottomPlane;
					break;
				case positionsEnum.VISIBLE_SIDE:
					var intersects = dragRaycaster.intersectObject(scope.caseGroup.visibleSidePlane);
					var tempPlane = scope.caseGroup.visibleSidePlane;
					break;
				case positionsEnum.INVISIBLE_SIDE:
					var intersects = dragRaycaster.intersectObject(scope.caseGroup.invisibleSidePlane);
					var tempPlane = scope.caseGroup.invisibleSidePlane;
					break;
			}

			var returnObj = new Object();
			returnObj.intersects = intersects;
			returnObj.tempPlane = tempPlane;

			return returnObj;
		}

		/*Updates the position of the fanAOEObject for a given fan, used when moving a fan
		  fan = The fan being moved*/
		scope.determineFanAOEPosition = function(fan) {
			if (fan == null) {
				var fan = scope.dragFan;
			}		

			switch(fan.properties.position) {
				case positionsEnum.FRONT:
					fan.fanAOEObject.position.set(fan.fanPhysicalObject.position.x, fan.fanPhysicalObject.position.y, fan.fanPhysicalObject.position.z + (fan.fanAOEObject.dimensions.height/2) + (fan.fanPhysicalObject.dimensions.depth/2));
					break;
				case positionsEnum.BACK:
					fan.fanAOEObject.position.set(fan.fanPhysicalObject.position.x, fan.fanPhysicalObject.position.y, fan.fanPhysicalObject.position.z - (fan.fanAOEObject.dimensions.height/2) - (fan.fanPhysicalObject.dimensions.depth/2));
					break;
				case positionsEnum.TOP:
					fan.fanAOEObject.position.set(fan.fanPhysicalObject.position.x, fan.fanPhysicalObject.position.y - (fan.fanAOEObject.dimensions.height/2) - (fan.fanPhysicalObject.dimensions.depth/2), fan.fanPhysicalObject.position.z);
					break;
				case positionsEnum.BOTTOM:
					fan.fanAOEObject.position.set(fan.fanPhysicalObject.position.x, fan.fanPhysicalObject.position.y + (fan.fanAOEObject.dimensions.height/2) + (fan.fanPhysicalObject.dimensions.depth/2), fan.fanPhysicalObject.position.z);
					break;
				case positionsEnum.VISIBLE_SIDE:
					fan.fanAOEObject.position.set(fan.fanPhysicalObject.position.x + (fan.fanAOEObject.dimensions.height/2) + (fan.fanPhysicalObject.dimensions.depth/2), fan.fanPhysicalObject.position.y, fan.fanPhysicalObject.position.z);
					break;
				case positionsEnum.INVISIBLE_SIDE:
					fan.fanAOEObject.position.set(fan.fanPhysicalObject.position.x - (fan.fanAOEObject.dimensions.height/2) - (fan.fanPhysicalObject.dimensions.depth/2), fan.fanPhysicalObject.position.y, fan.fanPhysicalObject.position.z);
					break;
			}
		}

		/*Returns a fanObject if the mouse is touching one, else nothing is returned*/
		function detectTouchingFan(event) {

			//Have to normalise these coords so that they are between -1 and 1
			mouse.x = (((event.clientX - document.getElementById('tabbedPaneContainer').offsetWidth) / width) * 2 - 1); //Have to minus the tabbedPaneContainer width because otherwise it would be included in the normalising to get X in terms of the canvas
			mouse.y = - (event.clientY / height) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

			//Isolate the fanPhysicalObjects from the root fan objects
			var fanPhysicalObjects = [];
			for (var i = 0; i < scope.fans.length; i++) {
				fanPhysicalObjects.push(scope.fans[i].fanPhysicalObject);
			}

		    //Isolate case planes into array
			var casePlanes = [];
			for(var key in scope.caseGroup) {
			    casePlanes.push(scope.caseGroup[key]);
			}

		    //Isolate objects into array
			var objects = [];
			for(var key in scope.caseGroup) {
			    objects.push(scope.caseGroup[key]);
			}
			for (var i = 0; i < scope.fans.length; i++) {
				objects.push(scope.fans[i].fanPhysicalObject);
			}

			var intersectsObjects = raycaster.intersectObjects(objects, true);

			if (intersectsObjects.length > 0) {
				var posToCheck = 0;
				for (var i = 0; i < casePlanes.length; i++) {
					//If first object is a case return null, we don't want to click fans through case planes (except for the invisible side plane)
					if (casePlanes[i].id == intersectsObjects[posToCheck].object.id) {
						//Detect if we clicked "through" the invisible side
						if (casePlanes[i].isInvisible == true) {
							posToCheck++;
							break;
						} else {
							return null;
						}
					}
				}
				if (intersectsObjects[posToCheck] === undefined) {
					return null;
				}
				//If we didn't touch a visible case plane first, check if we touched a fan
				for (var i = 0; i < scope.fans.length; i++) {
					if (scope.fans[i].fanPhysicalObject.id == intersectsObjects[posToCheck].object.id) {
						return scope.fans[i];
					}
				}
			} else {
				return null;
			}
		}

		/*Returns a case plane if a mouse is touching on, else nothing is returned*/
		function detectTouchingCase(event) {

			//Have to normalise these coords so that they are between -1 and 1
			mouse.x = (((event.clientX - document.getElementById('tabbedPaneContainer').offsetWidth) / width) * 2 - 1); //Have to minus the tabbedPaneContainer width because otherwise it would be included in the normalising to get X in terms of the canvas
			mouse.y = - (event.clientY / height) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

			//Isolate case planes into array
			var casePlanes = [];
			for(var key in scope.caseGroup) {
			    casePlanes.push(scope.caseGroup[key]);
			}

			var intersectsCase = raycaster.intersectObjects(casePlanes, true);

			//If we have touched a case plane return it
			if (intersectsCase.length > 0) {;
				for (var i = 0; i < casePlanes.length; i++) {
					if (casePlanes[i].id == intersectsCase[0].object.id) {
						return casePlanes[i];
					}
				}
			} else {
				return null;
			}
		}

		/*For a given fan and given side of the case, check whether the fan is in a valid position
		  e.g a fan shouldn't be able to be in the same position as another fan, or hang off the side
		  of the case.
		  fan = The fan that we are moving and checking if it is in a valid position
		  position = The enum for the side of the case the fan we are moving*/
		scope.isValidFanPosition = function(fan, position) {

			var valid = true;
			var samePlaneFans = [];
			var currentPos = position;

			for (var i = 0; i < scope.fans.length; i++) {
				if (scope.fans[i].properties.position === currentPos && scope.fans[i].id !== fan.id) {
					samePlaneFans.push(scope.fans[i]);				
				}
			}

			//if (samePlaneFans.length !== 0) {
				//Only check if a fan intersects another fan on the same case plane

				var invalidAreas = [];

				var editFanCenterXPos, editFanCenterYPos, checkFanCenterXPos, checkFanCenterYPos;
				
				//For all fans that exist on the same case plane as the edit fan, we get the area they inhabit. The edit fan cannot be allowed to go into this inhabited area.
				//Credit to Charles Bretana at https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
				switch(currentPos) {
						case positionsEnum.FRONT:
							axisX = "X";
							axisY = "Y";
							break;
						case positionsEnum.BACK:
							axisX = "X";
							axisY = "Y";
							break;
						case positionsEnum.TOP:
							axisX = "X";
							axisY = "Z";
							break;
						case positionsEnum.BOTTOM:							
							axisX = "X";
							axisY = "Z";
							break;
						case positionsEnum.VISIBLE_SIDE:							
							axisX = "Z";
							axisY = "Y";
							break;
						case positionsEnum.INVISIBLE_SIDE:
							axisX = "Z";
							axisY = "Y";
							break;
					//}
			}

			//Get the area that the edit fan is inhabiting
			if (fan.fanPhysicalObject == null || fan.fanPhysicalObject == undefined) {
				var editFanHalfHeight = scope.defaultNewFan.fanObject.dimensions.height/2;
				var editFanHalfWidth = scope.defaultNewFan.fanObject.dimensions.width/2;
				if (axisX === "X") {
					var editFanCenterX = fan.position.x;
				} else if (axisX === "Z") {
					var editFanCenterX = fan.position.z;
				}
				if (axisY === "Y") {
					var editFanCenterY = fan.position.y;
				} else if (axisY === "Z") {
					var editFanCenterY = fan.position.z;
				}				
			} else {
				var editFanHalfHeight = fan.fanPhysicalObject.dimensions.height/2;
				var editFanHalfWidth = fan.fanPhysicalObject.dimensions.width/2;			
				if (axisX === "X") {
					var editFanCenterX = fan.fanPhysicalObject.position.x;
				} else if (axisX === "Z") {
					var editFanCenterX = fan.fanPhysicalObject.position.z;
				}
				if (axisY === "Y") {
					var editFanCenterY = fan.fanPhysicalObject.position.y;
				} else if (axisY === "Z") {
					var editFanCenterY = fan.fanPhysicalObject.position.z;
				}
			}

			var editFanArea = new Object();
			
			editFanArea.X1 = editFanCenterX + editFanHalfWidth;		//X1 left
			editFanArea.Y1 = editFanCenterY + editFanHalfHeight;	//Y1 top
			editFanArea.X2 = editFanCenterX - editFanHalfWidth;		//X2 right
			editFanArea.Y2 = editFanCenterY - editFanHalfHeight;	//Y2 bottom
			

			//Get the area other fans on the same plane inhabit
			for (var i = 0; i < samePlaneFans.length; i++) {
				var checkFanHalfHeight = samePlaneFans[i].fanPhysicalObject.dimensions.height/2;
				var checkFanHalfWidth = samePlaneFans[i].fanPhysicalObject.dimensions.width/2;				
				if (axisX === "X") {
					var checkFanCenterX = samePlaneFans[i].fanPhysicalObject.position.x;
				} else if (axisX === "Z") {
					var checkFanCenterX = samePlaneFans[i].fanPhysicalObject.position.z;
				}
				if (axisY === "Y") {
					var checkFanCenterY = samePlaneFans[i].fanPhysicalObject.position.y;
				} else if (axisY === "Z") {
					var checkFanCenterY = samePlaneFans[i].fanPhysicalObject.position.z;
				}

				var checkFanArea = new Object();

				checkFanArea.X1 = checkFanCenterX + checkFanHalfWidth;		//X1 left
				checkFanArea.Y1 = checkFanCenterY + checkFanHalfHeight;		//Y1 top
				checkFanArea.X2 = checkFanCenterX - checkFanHalfWidth;		//X2 right
				checkFanArea.Y2 = checkFanCenterY - checkFanHalfHeight;		//Y2 bottom

				if (!(editFanArea.X1 < checkFanArea.X2) && !(editFanArea.X2 > checkFanArea.X1) && !(editFanArea.Y1 < checkFanArea.Y2) && !(editFanArea.Y2 > checkFanArea.Y1)) {
					valid = false;
				}
			}

			//Now check if fan "hangs" off the case
			var casePlane = null;
			var casePlanes = [];
			for (var key in scope.caseGroup) {
			    casePlanes.push(scope.caseGroup[key]);
			}

			for (var i = 0; i < casePlanes.length; i++) {
				if (casePlanes[i].positionCode === currentPos) {
					casePlane = casePlanes[i];
				}
			}

			if (casePlane !== null) {
				//Should never be null but its safer to check

				var casePlaneHalfHeight = casePlane.dimensions.height/2;
				var casePlaneHalfWidth = casePlane.dimensions.width/2;				
				if (axisX === "X") {
					var casePlaneCenterX = casePlane.position.x;
				} else if (axisX === "Z") {
					var casePlaneCenterX = casePlane.position.z;
				}
				if (axisY === "Y") {
					var casePlaneCenterY = casePlane.position.y;
				} else if (axisY === "Z") {
					var casePlaneCenterY = casePlane.position.z;
				}

				var checkCaseArea = new Object();

				checkCaseArea.X1 = (casePlaneCenterX + casePlaneHalfWidth);		//X1 left
				checkCaseArea.Y1 = (casePlaneCenterY + casePlaneHalfHeight);	//Y1 top
				checkCaseArea.X2 = (casePlaneCenterX - casePlaneHalfWidth);		//X2 right
				checkCaseArea.Y2 = (casePlaneCenterY - casePlaneHalfHeight);	//Y2 bottom

				if (editFanArea.X1 > checkCaseArea.X1 || editFanArea.X2 < checkCaseArea.X2 || editFanArea.Y2 < checkCaseArea.Y2 || editFanArea.Y1 > checkCaseArea.Y1) {
					valid = false;
				}
			}


			if (valid === true) {
				//Change to valid pos color
				if (scope.dragFan != null) {
					scope.dragFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.validEdit));
					scope.dragFan.properties.isValidPos = true;
				} else if (scope.addingFan == true) {
					scope.newFanPlaceholderWireframe.material.color.setHex(parseInt(scope.fanColors.validEdit));
					scope.addingFanValidPos = true;
				}
			} else {
				//Change to invalid pos color
				if (scope.dragFan != null) {
					scope.dragFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.invalidEdit));
					scope.dragFan.properties.isValidPos = false;
				} else if (scope.addingFan == true) {
					scope.newFanPlaceholderWireframe.material.color.setHex(parseInt(scope.fanColors.invalidEdit));
					scope.addingFanValidPos = false;
				}
			}
		} 

		/*Dynamically resizes 3D renderer and camera when browser window is resized*/
		function onWindowResize(){

			width = document.getElementById('simulationContainer').offsetWidth;
			height = document.getElementById('simulationContainer').offsetHeight;

		    camera.aspect = width / height;
		    camera.updateProjectionMatrix();

		    renderer.setSize( width, height );

		}

		//TODO (IN ORDER):
		// - Input validation on ALL user enterable data (using Angular) 							- AND UNIT TESTS
		// - User configurable project settings 													- AND UNIT TESTS
		// - Results tab (Optimisation %, % of particles that had to be culled, dust buildup etc.)	- AND UNIT TESTS		
		// - Recheck WEB-ARIA roles and properties
		// - Reqrite how to use/about popup
		// - Standardised error messages
		// - Clean up code, optimisation, proper documentation etc. SEE quality standards in interim report
		// - Testing on multiple devices
		// - Be able to import a computer case 3D model and smartly generate physics planes based off 3D geometry (OPTIONAL)
		// - Fan model and animations (OPTIONAL)
		// - User defined case settings (OPTIONAL)
    }
  }; 
};

module.exports = simulation;
