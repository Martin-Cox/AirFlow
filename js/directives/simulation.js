app.directive('simulation', ['$http', 'defaultsService', function($http, defaultsService) { 
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/simulation.html',
    link: function(scope, elem, attr) {

    	var camera, scene, renderer, width, height, clock, orbitControl, fpsStats, intersectedObject;
		var particles = [];
		var availableParticles = [];
		var fans = [];
		var exhaustFans = [];
		var intakeFans = [];
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();

		var hoverFanColor = 0xD88080;
		var editFanColor = 0x00FF00;
		var normalFanColor = 0xB20000;

		var caseDefaults;

		getDefaults();

		function getDefaults() {
			//Get defaults using defaultsService, then when all promises are fulfilled, run init and anim functions
			//TODO: Implement promises into defaultsService
			caseDefaults = defaultsService.getCaseDefaults();
			var x = 4;
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

			createCase();

			createFan("intake", new THREE.Vector3(0, 100, -450));
			createFan("exhaust", new THREE.Vector3(0, 700, 450));

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

			spawnParticles();
			cullParticles();

			renderer.domElement.addEventListener( 'mousemove', handleMouseMove, false );
			renderer.domElement.addEventListener( 'mousedown', handleMouseClick, false );
		}

		function animate() {
			//Animates/simulates scene

			fpsStats.begin();

			scene.simulate(); //Run physics simulation

			requestAnimationFrame(animate);
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

				var sphereGeometry = new THREE.SphereGeometry(10, 16, 16);

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

		function spawnParticles() {	
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
		        	spawnParticles();
		        }, spawnRate);
			} else {
				setTimeout(function() {
		        	spawnParticles();
		        }, spawnRate);
			}
		}

		function setParticleStartingPosition(particle) {
			//Chooses a random intake fan to act as a starting point, then randomises the starting coordinates within the fanAOEObject

			//Randomly select one of the intake fans to act as a spawn point for this particle
			var fanObject = intakeFans[Math.floor(Math.random()*intakeFans.length)];
			var spawnPosition = new THREE.Vector3();

			var x = scope;

			//Randomise the position the particle will spawn in the fanAOEObject
			spawnPosition.x = fanObject.fanAOEObject.position.x + ((Math.random() - 0.9 ) * 100);
			spawnPosition.y = fanObject.fanAOEObject.position.y + ((Math.random() - 0.9 ) * 100);
			spawnPosition.z = fanObject.fanAOEObject.position.z - ((Math.random() - 0.9 ) * 150);

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

		function createCase() {
			//Creates a 3D model of a computer case

			if (caseDefaults.dimensions != null) {
				console.log("success");
			} else {
				console.log("failure");
			}

			var caseGroup = new THREE.Object3D(); //Empty container to store each case plane in

			var caseMaterial = Physijs.createMaterial(
		      	new THREE.MeshLambertMaterial({
					color: 0x5F6E7D
				}),
		      	0.3, // friction
		      	0.1 // restitution
		    );

			var transparentMaterial = new THREE.MeshBasicMaterial({ 
			    opacity: 0.2,
			    color: 0x5F6E7D,
			    transparent: true,
			    side: THREE.DoubleSide
			});

			var componentMaterial = new THREE.MeshLambertMaterial({
				color: 0xD5D3D0
			})

			var caseWidth = 300;
			var caseHeight = 800;
			var caseLength = 900;
			var caseThickness = 4;
			var fanHoleSize = 200;

			var caseBottomGeometry = new THREE.CubeGeometry(caseWidth, caseThickness, caseLength);
			var caseTopGeometry = new THREE.CubeGeometry(caseWidth, caseThickness, caseLength);
			var caseVisibleSideGeometry = new THREE.CubeGeometry(caseThickness, caseHeight, caseLength);
			var caseInvisibleSideGeometry = new THREE.CubeGeometry(caseThickness, caseHeight, caseLength);
			var caseBackGeometry = new THREE.CubeGeometry(caseWidth, caseHeight - fanHoleSize, caseThickness);
			var caseFrontGeometry = new THREE.CubeGeometry(caseWidth, caseHeight - fanHoleSize, caseThickness);

			var gpuGeometry = new THREE.CubeGeometry(caseWidth - 100, 25, 375);

			var caseBottomPlane = new Physijs.BoxMesh(caseBottomGeometry, caseMaterial, 0); //Gravity, 0 = weightless
			var caseTopPlane = new Physijs.BoxMesh(caseTopGeometry, caseMaterial, 0); //Gravity, 0 = weightless
			var caseVisibleSidePlane = new Physijs.BoxMesh(caseVisibleSideGeometry, caseMaterial, 0); //Gravity, 0 = weightless
			var caseInvisibleSidePlane = new Physijs.BoxMesh(caseInvisibleSideGeometry, transparentMaterial, 0); //Gravity, 0 = weightless
			var caseBackPlane = new Physijs.BoxMesh(caseBackGeometry, caseMaterial, 0); //Gravity, 0 = weightless
			var caseFrontPlane = new Physijs.BoxMesh(caseFrontGeometry, caseMaterial, 0); //Gravity, 0 = weightless

			var gpuPlane = new Physijs.BoxMesh(gpuGeometry, componentMaterial, 0); //Gravity, 0 = weightless

			caseBottomPlane.position.set(0, 0, 0);

			caseTopPlane.position.set(0, caseHeight, 0);

			caseVisibleSidePlane.position.set(-caseWidth/2, caseHeight/2, 0);

			caseInvisibleSidePlane.position.set(caseWidth/2, caseHeight/2, 0);

			caseBackPlane.position.set(0, caseHeight/2 - (fanHoleSize/2), caseLength/2);

			caseFrontPlane.position.set(0, caseHeight/2 + (fanHoleSize/2), -caseLength/2);

			gpuPlane.position.set(-45, caseHeight/2 - 100, 200);

			scene.add(caseBottomPlane);
			scene.add(caseTopPlane);
			scene.add(caseVisibleSidePlane);
			scene.add(caseInvisibleSidePlane);
			scene.add(caseBackPlane);
			scene.add(caseFrontPlane);
			scene.add(gpuPlane);
		}

		function createFan(paramMode, position) {
			/*A fan is made up a of a fanObject with two sub-objects, a fanAOEObject representing the area of effect for a fan
			and the fanPhysicalObject, which is the physical fan the user sees*/

			//------------------------CREATE FAN AOE OBJECT-----------------------//
			var fanAOEMaterial = new THREE.MeshLambertMaterial({
				opacity: 0,
			    color: normalFanColor,
			    transparent: true,
			    side: THREE.DoubleSide
			})
;
			var fanAOEGeometry = new THREE.CylinderGeometry(100, 100, 200, 50, 50);
			var fanAOEObject = new Physijs.CylinderMesh(fanAOEGeometry, fanAOEMaterial, 0); //Gravity, 0 = weightless

			fanAOEObject.rotation.x = 90 * Math.PI/180;	//Rotate the cylinder 90 degrees, Three.js uses radians, so convert ot radians first
 

			//Checking param mode here to ffset positions, this is only a temp solution, actual xyz coords will be in a JSON
			if (paramMode == "intake") {
				fanAOEObject.position.set(position.x, position.y, position.z + 100);
			} else {
				fanAOEObject.position.set(position.x, position.y, position.z - 100);
			}

			fanAOEObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			scene.add(fanAOEObject);
			//------------------------CREATE FAN AOE OBJECT-----------------------//

			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//
			var fanPhysicalMaterial = new THREE.MeshLambertMaterial ({
				color: normalFanColor,
				side: THREE.DoubleSide
			})

			var fanPhysicalGeometry = new THREE.CubeGeometry(300, 200, 50);
			var fanPhysicalObject = new Physijs.BoxMesh(fanPhysicalGeometry, fanPhysicalMaterial, 0); //Gravity, 0 = weightless

			fanPhysicalObject.position.set(position.x, position.y, position.z);
			fanPhysicalObject._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it

			scene.add(fanPhysicalObject);
			//------------------------CREATE FAN PHYSICAL OBJECT-----------------------//

			var fan = new Object();

			fan.fanAOEObject = fanAOEObject;
			fan.fanPhysicalObject = fanPhysicalObject;
			fan.id = fanPhysicalObject.id;
			fan.editing = false;
			fan.mode = paramMode;
			fan.AOEWireframe = new THREE.EdgesHelper(fanAOEObject, 0x90DAFF);
			//fan.AOEWireframe = new THREE.WireframeHelper(fanAOEObject, 0x90DAFF);

			if (paramMode == "intake") {
				intakeFans.push(fan);
			} else if (paramMode == "exhaust") {
				exhaustFans.push(fan);
			}

			fans.push(fan);	
		}

		function handleCollision(collided_with, linearVelocity, angularVelocity) {
			//TODO: Get forceVector from fanObject

			//Event gets called when physics objects (spheres) collide with another object
			for (var i = 0; i < fans.length; i++) {
				if (collided_with.id === fans[i].fanAOEObject.id) {
					//Collided with fanAOEObject, apply suitable force
					if ( fans[i].mode === "intake" ) {
						var forceVector = new THREE.Vector3(0, 50000, 300000); 	//Force/Impulse is quantified by units pushing in a 3 axis directions. NOTE: A really big number is needed to produce any noticeable affect
					} else if (fans[i].mode === "exhaust" ) {
						var forceVector = new THREE.Vector3(0, 0, 1000000); 	//Force/Impulse is quantified by units pushing in a 3 axis directions. NOTE: A really big number is needed to produce any noticeable affect
					}			
					this.applyCentralImpulse(forceVector);
				} else if (collided_with.id === fans[i].fanPhysicalObject.id && fans[i].mode === "exhaust") {
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
			for (var i = 0; i < fans.length; i++) {
				if (fans[i].editing == false) {
					fans[i].fanPhysicalObject.material.color.setHex(normalFanColor);
				}
			}

			if (touchFan) {
				//Only change to hover color when we are NOT editing the current fan
				if (touchFan.editing == false) {
					touchFan.fanPhysicalObject.material.color.setHex(hoverFanColor);
				}
			}
		}

		function handleMouseClick(event) {
			//When a user clicks on a fan, open the component control panel section and change fan color

			var touchFan = detectTouchingFan(event);

			//For peace of mind, reset all fans to not editing when we click
			for (var i = 0; i < fans.length; i++) {
				fans[i].editing = false;
				fans[i].fanPhysicalObject.material.color.setHex(normalFanColor);
				scene.remove(fans[i].AOEWireframe); 
				//document.getElementById(fans[i].id).style.color = "black";
			}

			//If we clicked on a fan, do stuff here
			if (touchFan) {
				touchFan.fanPhysicalObject.material.color.setHex(editFanColor);
				touchFan.editing = true;
				scene.add(touchFan.AOEWireframe);
				//document.getElementById(touchFan.id).style.color = "red";	//Placeholder. When user clicks on the fan it's component section will display
			}
		}

		function detectTouchingFan(event) {
			//Returns a fanObject if the mouse is touching one, else nothing is returned

			//Have to normalise these coords so that they are between -1 and 1
			mouse.x = ( ( (event.clientX - document.getElementById('tabbedPaneContainer').offsetWidth) / width ) * 2 - 1); //Have to minus the tabbedPaneContainer width because oftherwise it would be included in the normalising to get X in terms of the canvas
			mouse.y = - ( event.clientY / height ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );

			//Isolate the fanPhysicalObjects from the root fan objects
			var fanPhysicalObjects = [];
			for (var i = 0; i < fans.length; i++) {
				fanPhysicalObjects.push(fans[i].fanPhysicalObject);
			}

			var intersects = raycaster.intersectObjects( fanPhysicalObjects, true );

			//If we have touched a fanPhysicalObject, return the root fanObject it belongs to
			if ( intersects.length > 0 ) {;
				for (var i = 0; i < fans.length; i++) {
					if (fans[i].fanPhysicalObject.id == intersects[0].object.id) {
						return fans[i];
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
		// - Loading screen displays ready when still making http AJAX calls in get defaults, need to change this so only changes to ready on document ready AND AJAX call success/failure
		// - Move initial animate() call to only get called when the user actually clicks past the loading screen 
		// - Actually read and use JSON data to create case geometry	
		// - Fan model and animations
		// - Color change of particles that have been around for a long time
		// - Create component settings controller <component-Settings id="fan.id" for each fan
		// - Read default fan information from JSON file 											- AND UNIT TESTS
		// - Simulation updates automatically when settings changes 								- AND UNIT TESTS
		// - User configurable fan settings on fan-by-fan basis (RPM, mode, active/inactive etc.)	- AND UNIT TESTS
		// - User configurable environment settings 												- AND UNIT TESTS
		// - User configurable project settings 													- AND UNIT TESTS
		// - Results tab (Optimisation %, % of particles that had to be culled, dust buildup etc.)	- AND UNIT TESTS
		// - Change rate of spawning in particles dependant on the number of intake fans
		// - Simulation quality settings (AA on/off) 
		// - How to use overlay
		// - About popup
		// - Clean up code, optimisation, proper documentation etc. SEE quality standards in interim report
		// - Testing on multiple devices
		// - Save information to a .airflow file (OPTIONAL)
		// - Upload project from .airflow file (OPTIONAL)
		// - User defined case settings (OPTIONAL)

		//OTHER NOTES:
		// - Maybe use an eventListener for when $scope changes instead of checking every update frame -> better for perfomance
		// - Not all fans will be intake or exhaust, e.g. GPU/CPU fan will be neither
		// - For performance reason, it may be beneficial to keep track of a particles original spawn position, and just move it there on recycle, instead of calculating a new one each time)

    }
  }; 
}]);