app.directive('simulation', ['$http', 'defaultsService', function($http, defaultsService) { 
  return { 
    restrict: 'E', 
    scope: false,
    templateUrl: 'js/directives/simulation.html',
    link: function(scope, elem, attr) {

    	var camera, scene, renderer, width, height, clock, orbitControl, fpsStats, intersectedObject;
		var particles = [];
		var availableParticles = [];
		var insideCase;
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();

		getDefaults();

		function getDefaults() {
			//Get defaults using defaultsService, then when all promises are fulfilled, run init and anim functions
			var caseDefaultsPromise = defaultsService.getCaseDefaults();
			caseDefaultsPromise.then(function(result) {
				//Function run only after service AJAX call has completed
				//TODO: Handle if error returned, create error message dialog
				scope.defaultCase = result;
				var fanDefaultsPromise = defaultsService.getFanDefaults();
				fanDefaultsPromise.then(function(result) {
					//Function run only after service AJAX call has completed
					//TODO: Handle if error returned, create error message dialog

					//Need to change this value after all AJAX calls have completed to notify controller that loading has completed
					scope.ajaxComplete = true;

					//Store default values in the scope variables
					scope.fanColors = result.colors;
					scope.defaultFans = result;

					//Create the 3D scene
					init();
				});
			});
		}

		function init() {
			//Loads physijs files, creates scene etc.

			Physijs.scripts.worker = '/js/external/physijs_worker.js';
			Physijs.scripts.ammo = '/js/external/ammo.js';

			window.addEventListener( 'resize', onWindowResize, false);

			width = document.getElementById('simulationContainer').offsetWidth;
			height = document.getElementById('simulationContainer').offsetHeight;

			fpsStats = new Stats();
			fpsStats.setMode(0);

			fpsStats.domElement.style.position = 'absolute';
			fpsStats.domElement.style.right = '0px';
			fpsStats.domElement.style.top = '0px';

			document.getElementById("simulationContainer").appendChild(fpsStats.domElement);

			renderer = new THREE.WebGLRenderer ( { antialias: true});
			renderer.setSize(width, height);
			document.getElementById("simulationContainer").appendChild(renderer.domElement);

			scene = new Physijs.Scene;

			scene.setGravity(new THREE.Vector3( 0, 12, 0));

			createDefaultCase(scope.defaultCase);

			createDefaultFan(scope.defaultFans.fanOne);
			createDefaultFan(scope.defaultFans.fanTwo);

			camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);

			camera.position.x = 800;
			camera.position.y = 800;
			camera.position.z = -800;

			scene.add(camera);

			orbitControl = new THREE.OrbitControls(camera, document.getElementById('simulationContainer'));
			//orbitControl.enablePan = false;
			orbitControl.constraint.minDistance = 600;
			orbitControl.constraint.maxDistance = 2200;
			clock = new THREE.Clock();


			var skyboxGeometry = new THREE.CubeGeometry(9000, 9000, 9000);
			var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x262B30, side: THREE.BackSide });
			var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

			scene.add(skybox);

			createParticles(100);

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

			cullParticles();

			renderer.domElement.addEventListener( 'mousemove', handleMouseMove, false );
			renderer.domElement.addEventListener( 'mousedown', handleMouseClick, false );
		}

		scope.animate = function() {
			//Animates/simulates scene

			fpsStats.begin();

			scene.simulate(); //Run physics simulation

			requestAnimationFrame(scope.animate);
			var delta = clock.getDelta();
			orbitControl.update(delta);

			renderer.render(scene, camera);

			fpsStats.end();
		}

		function createParticles(numToCreate) {
			//Creates the pool of particles that will be added to the scene

			for (var i = 0; i < numToCreate; i++) {
				var particle;

				var randNum = Math.random();
				var matColor;

				if (randNum < 0.34) {
					matColor = 0xD9216A;
				} else if (randNum > 0.34 && randNum < 0.67) {
					matColor = 0x18ABDB;
				} else {
					matColor = 0x18DB3F;
				}

				var sphereGeometry = new THREE.SphereGeometry(5, 16, 16);

				var sphereMaterial = Physijs.createMaterial(
			      new THREE.MeshLambertMaterial({
			        color: matColor
			      }),
			      0.3, // friction
			      1 // restitution
			    );

				particle = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);	

				setParticleStartingPosition(particle);

				particle.addEventListener( 'collision', handleCollision);

				particles.push(particle);
				availableParticles.push(particle);
			}
		}

		scope.spawnParticles = function() {
			//Adds the first available particle to the scene every spawnRate ms. If none are available, wait spawnRate ms and check again

			var spawnRate = 300;

			if (availableParticles.length > 0) {

				//Record the unix time ms that the particle spawned
				availableParticles[0].spawnTime = (new Date).getTime();

				//Add first available particle to scene
				scene.add(availableParticles[0]);

				//Remove from pool of available particles
				availableParticles.splice(0, 1);

				setTimeout(function() {
		        	scope.spawnParticles();
		        }, spawnRate);
			} else {
				setTimeout(function() {
		        	scope.spawnParticles();
		        }, spawnRate);
			}
		}

		function setParticleStartingPosition(particle) {
			//Chooses a random intake fan to act as a starting point, then randomises the starting coordinates within the fanAOEObject

			//Randomly select one of the intake fans to act as a spawn point for this particle
			var fanObject = scope.intakeFans[Math.floor(Math.random()*scope.intakeFans.length)];

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

		function recycleParticle(particle) {
			//Removes a particle from the scene, resets its starting position, and adds it back to the pool of available particles

			scene.remove(particle);

			setParticleStartingPosition(particle);

			particle.spawnTime = null;

			availableParticles.push(particle);
		}

		function cullParticles() {	
			//Removes a particle from the scene using recycleParticle() if it has existed for too long. 
			//cullTime is an integer in ms representing the longest amount of time before the particle should be culled. Will be configurable in project settings
			//recheckTime is an integer in ms represeting the preiod of time between checking for particles that need to be culled. Will be configurable in sim quality settings

			var recheckTime = 1000; //1 second, debug value

			if (particles.length > 0) {

				var cullTime = 30000; //30 seconds, debug value

				var unixTime = (new Date).getTime();

				for (var i = 0; i < particles.length; i++) {
					if (particles[i].spawnTime != null && unixTime - particles[i].spawnTime >= cullTime) {
						recycleParticle(particles[i]);
					}
				}

				setTimeout(function() {
		        	cullParticles();
		        }, recheckTime);
			} else {
				setTimeout(function() {
		        	cullParticles();
		        }, recheckTime);
			}
		}

		function createDefaultCase(caseDefaults) {
			//Creates a 3D model of a computer case

			var caseMaterial = Physijs.createMaterial(
		      	new THREE.MeshLambertMaterial({
					color: parseInt(caseDefaults.materials.caseMaterial.color)
				}),
		      	caseDefaults.materials.caseMaterial.friction,
		      	caseDefaults.materials.caseMaterial.restitution
		    );

			var insideBoxMaterial = Physijs.createMaterial(
				new THREE.MeshBasicMaterial({ 
				    opacity: caseDefaults.materials.insideBoxMaterial.opacity,
				    color: parseInt(caseDefaults.materials.insideBoxMaterial.color),
				    transparent: caseDefaults.materials.insideBoxMaterial.transparent,
				    side: caseDefaults.materials.insideBoxMaterial.side
				}),
				caseDefaults.materials.insideBoxMaterial.friction,
				caseDefaults.materials.insideBoxMaterial.restitution
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

			//Increase size of case TODO:Maybe remove this and change zoom levels and speed of orbit camera
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

			//Create an invisible mesh that fills the inside of the case, it will be used to detect the difference between the inside/outside of a case
			insideCase = new Physijs.BoxMesh(new THREE.CubeGeometry(caseWidth, caseHeight, caseDepth), insideBoxMaterial, 0); //Gravity, 0 = weightless
			insideCase._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			caseBottomPlane.position.set(0, 0, 0);

			caseTopPlane.position.set(0, caseHeight, 0);

			caseVisibleSidePlane.position.set(-caseWidth/2, caseHeight/2, 0);

			caseInvisibleSidePlane.position.set(caseWidth/2, caseHeight/2, 0);

			caseBackPlane.position.set(0, caseHeight/2, caseDepth/2);

			caseFrontPlane.position.set(0, caseHeight/2, -caseDepth/2);

			insideCase.position.set(0, caseHeight/2, 0);

			scene.add(caseBottomPlane);
			scene.add(caseTopPlane);
			scene.add(caseVisibleSidePlane);
			scene.add(caseInvisibleSidePlane);
			scene.add(caseBackPlane);
			scene.add(caseFrontPlane);
			scene.add(insideCase);

			//Add the visible case panels to the scope caseGroup object for use elsewhere
			scope.caseGroup.push(caseBottomPlane);
			scope.caseGroup.push(caseTopPlane);
			scope.caseGroup.push(caseVisibleSidePlane);
			scope.caseGroup.push(caseBackPlane);
			scope.caseGroup.push(caseFrontPlane);
		}

		function createDefaultFan(fan) {
			/*A fan is made up a of a fanObject with two sub-objects, a fanAOEObject representing the area of effect for a fan
			and the fanPhysicalObject, which is the physical fan the user sees*/

			//------------------------CREATE FAN AOE OBJECT-----------------------//
			var fanAOEMaterial = new THREE.MeshLambertMaterial({
				opacity: fan.fanAOEObject.material.opacity,
			    color: parseInt(scope.fanColors.normal),
			    transparent: fan.fanAOEObject.material.transparent,
			    side: fan.fanAOEObject.material.side
			});

			var fanAOEObject = new Physijs.CylinderMesh(new THREE.CylinderGeometry(fan.fanAOEObject.dimensions.radiusTop, fan.fanAOEObject.dimensions.radiusBottom, fan.fanAOEObject.dimensions.height, fan.fanAOEObject.dimensions.radiusSegments, fan.fanAOEObject.dimensions.heightSegments), fanAOEMaterial, 0); //Gravity, 0 = weightless

			fanAOEObject.rotation.x = 90 * Math.PI/180;	//Rotate the cylinder 90 degrees, Three.js uses radians, so convert ot radians first
 
			fanAOEObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			//Checking param mode here to offset positions
			//TODO: Add support for fans that are neither intake or exhaust (e.g. GPU fan)
			if (fan.properties.mode != "exhaust") {
				fanAOEObject.position.set(fan.position.x, fan.position.y, fan.position.z + (fan.fanAOEObject.dimensions.height/2) + (fan.fanObject.dimensions.depth/2));
			} else {
				fanAOEObject.position.set(fan.position.x, fan.position.y, fan.position.z - (fan.fanAOEObject.dimensions.height/2) - (fan.fanObject.dimensions.depth/2));
			}

			scene.add(fanAOEObject);
			//------------------------CREATE FAN AOE OBJECT-----------------------//

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//
			var fanPhysicalMaterial = new THREE.MeshLambertMaterial ({
				color: parseInt(scope.fanColors.normal),
				side: fan.fanObject.material.side
			});

			var fanPhysicalObject = new Physijs.BoxMesh(new THREE.CubeGeometry(fan.fanObject.dimensions.width, fan.fanObject.dimensions.height, fan.fanObject.dimensions.depth), fanPhysicalMaterial, 0); //Gravity, 0 = weightless

			fanPhysicalObject.position.set(fan.position.x, fan.position.y, fan.position.z);
			fanPhysicalObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			scene.add(fanPhysicalObject);
			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//

			var fanObject = new Object();

			fanObject.properties = new Object();

			fanObject.fanAOEObject = fanAOEObject;
			fanObject.fanPhysicalObject = fanPhysicalObject;
			fanObject.id = fanPhysicalObject.id;
			fanObject.editing = false;
			fanObject.properties.mode = fan.properties.mode;
			fanObject.properties.size = fan.properties.size;
			fanObject.properties.maxRPM = fan.properties.rpm;
			fanObject.properties.percentageRPM = fan.properties.percentage;
			fanObject.AOEWireframe = new THREE.EdgesHelper(fanAOEObject, parseInt(scope.fanColors.wireframe));

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

		scope.calculateForceVector = function(fan) {
			//TODO: This only calculates Z axis force, it should change which axis it applies to depending on the placement of the fan

			var maxForce = ((fan.properties.size * 5000) + (fan.properties.maxRPM * 100));

			var realForce = (fan.properties.percentageRPM/1000)*maxForce;

			if (realForce > 300000) { realForce = 300000 }; //Max value is a magic number, will be explained why in documentation

			return new THREE.Vector3(0,0,realForce);
		}

		function handleCollision(collided_with, linearVelocity, angularVelocity) {
			//Event gets called when physics objects (spheres) collide with another object

			for (var i = 0; i < scope.fans.length; i++) {
				if (collided_with.id === scope.fans[i].fanAOEObject.id) {
					//Collided with fanAOEObject, apply suitable force
					this.applyCentralImpulse(scope.fans[i].properties.forceVector);
				} else if (collided_with.id === scope.fans[i].fanPhysicalObject.id && scope.fans[i].properties.mode === "exhaust") {
					//Collided with exhuast fanPhysicalObject, delete the particle
					for (var j = 0; j < particles.length; j++) {
						if (particles[j].id === this.id) {
							recycleParticle(particles[j]);
						}
					}
				}
			}
		}

		function handleMouseMove(event) {
			//When a user hovers on a fan change fan color to hover state only if we are NOT editing that fan 

			var touchFan = detectTouchingFan(event);

			//For peace of mind, reset all fans not being edited to normal fan color
			for (var i = 0; i < scope.fans.length; i++) {
				if (scope.fans[i].editing == false) {
					scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.normal));
				}
			}

			if (touchFan) {
				//Only change to hover color when we are NOT editing the current fan
				if (touchFan.editing == false) {
					touchFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.highlight));
				}
			}
		}

		function handleMouseClick(event) {
			//When a user clicks on a fan, open the component control panel section and change fan color

			var touchFan = detectTouchingFan(event);

			//For peace of mind, reset all fans to not editing when we click
			for (var i = 0; i < scope.fans.length; i++) {
				scope.fans[i].editing = false;
				scope.fans[i].fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.normal));
				scene.remove(scope.fans[i].AOEWireframe); 
				scope.editFan = null;
				scope.$digest();
			}

			//If we clicked on a fan, do stuff here
			if (touchFan) {
				touchFan.fanPhysicalObject.material.color.setHex(parseInt(scope.fanColors.edit));
				touchFan.editing = true;
				scene.add(touchFan.AOEWireframe);
				scope.editFan = touchFan;
				scope.$digest();
				orbitControl.enableRotate = false;
			} else {
				orbitControl.enableRotate = true;
			}
		}

		function detectTouchingFan(event) {
			//Returns a fanObject if the mouse is touching one, else nothing is returned

			//Have to normalise these coords so that they are between -1 and 1
			mouse.x = (((event.clientX - document.getElementById('tabbedPaneContainer').offsetWidth) / width) * 2 - 1); //Have to minus the tabbedPaneContainer width because oftherwise it would be included in the normalising to get X in terms of the canvas
			mouse.y = - (event.clientY / height) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

			//Isolate the fanPhysicalObjects from the root fan objects
			var fanPhysicalObjects = [];
			for (var i = 0; i < scope.fans.length; i++) {
				fanPhysicalObjects.push(scope.fans[i].fanPhysicalObject);
			}

			var x = scope.caseGroup;

			var intersectsFans = raycaster.intersectObjects(fanPhysicalObjects, true);
			var intersectsCase = raycaster.intersectObjects(scope.caseGroup, true);

			//If we have touched a fanPhysicalObject, return the root fanObject it belongs to
			if (intersectsFans.length > 0) {;
				for (var i = 0; i < scope.fans.length; i++) {
					if (scope.fans[i].fanPhysicalObject.id == intersectsFans[0].object.id) {
						return scope.fans[i];
					}
				}
			} else {
				return null;
			}
		}

		function onWindowResize(){
			//Dynamically resizes renderer and camera when window is resized

			width = document.getElementById('simulationContainer').offsetWidth;
			height = document.getElementById('simulationContainer').offsetHeight;

		    camera.aspect = width / height;
		    camera.updateProjectionMatrix();

		    renderer.setSize( width, height );

		}

		//TODO (IN ORDER):
		// - Implement draggable fans
		// - Determine the force axis for a fan by ode of operation and which (biggest!) side of the fan is touching the inside cube 
		// - User can "click" or "mouseover" a fan that is obscured by a case panel, preventing rotation - Fix using intersectsCase in detectTouchingFan
		// - Add components to defaultCase.json
		// - Color change of particles that have been around for a long time
		// - Move global variables to scope objects (see notes)
		// - Create component settings controller <component-Settings id="fan.id" for each fan
		// - Write algorithm to determine forceVector for a fan bvased upon: size, rpm, position in world etc.
		// - User configurable environment settings 												- AND UNIT TESTS
		// - User configurable project settings 													- AND UNIT TESTS
		// - Results tab (Optimisation %, % of particles that had to be culled, dust buildup etc.)	- AND UNIT TESTS
		// - Input validation on ALL user enterable data (using Angular)
		// - Change rate of spawning in particles dependant on the number of intake fans
		// - Simulation quality settings (AA on/off) 
		// - How to use overlay
		// - About popup
		// - Standardised error messages
		// - Clean up code, optimisation, proper documentation etc. SEE quality standards in interim report
		// - Testing on multiple devices
		// - Fan model and animations
		// - Save information to a .airflow file (OPTIONAL)
		// - Upload project from .airflow file (OPTIONAL)
		// - User defined case settings (OPTIONAL)

		//OTHER NOTES:
		// - Maybe use an eventListener for when $scope changes instead of checking every update frame -> better for perfomance
		// - Not all fans will be intake or exhaust, e.g. GPU/CPU fan will be neither
		// - For performance reason, it may be beneficial to keep track of a particles original spawn position, and just move it there on recycle, instead of calculating a new one each time)
		// - fanAOEObject radius should be 1/2 fan size
		// - Global vars should be scope objects e.g. fanNormalColor should be stored in $scope.fan, user defined fan properties in $scope.fans.0.rpm
		// - ^ Doing that we can use $scope.watch() to watch for changes to these variables which measn that we can easily notify the sim code of any updates.
		// - Because of the way angular works, I don't need to add methods to update the sim when the user changes values in the component section!
    }
  }; 
}]);
