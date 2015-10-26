var camera, scene, renderer, width, height, clock, orbitControl, fpsStats, intersectedObject;
var objects = [];
var fans = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

init();
debugaxis(100);
animate();

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

	createObjects(50);

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
	orbitControl.constraint.maxDistance = 100;
	orbitControl.constraint.maxDistance = 1600;
	clock = new THREE.Clock();


	var skyboxGeometry = new THREE.CubeGeometry(9000, 9000, 9000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x262B30, side: THREE.BackSide });
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

	scene.add(skybox);


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

	renderer.domElement.addEventListener( 'mousemove', handleMouseMove, false );
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

function createObjects(numToCreate) {
	//Creates numToCreate random physics objects to be used in the simulation
	for (var i=0; i < numToCreate; i++) {

		var object;

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
	      0.9 // restitution
        );

		object = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);	

		object.position.set((( Math.random() - 0.5 ) * 280), (( Math.random() - 0.25) * 200), (( Math.random() - 3.5 ) * 200));

		object.addEventListener( 'collision', handleCollision );

		scene.add(object);

		objects.push(object);
	}
}

function createCase() {
	//Creates a 3D model of a computer case

	var caseGroup = new THREE.Object3D(); //Empty container to store each case plane in

	var caseMaterial = new THREE.MeshLambertMaterial({
		color: 0x5F6E7D
	})

	var transparentMaterial = new THREE.MeshBasicMaterial({ 
	    opacity: 0.2,
	    color: 0x5F6E7D,
	    transparent: true,
	    side: THREE.DoubleSide
	});

	var componentMaterial = new THREE.MeshLambertMaterial({
		color: 0xD5D3D0
	})

	var caseWidth = 350;
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
	//------------------Testing adding fans--------------------//

	//Test out apply force
	var fanMaterial = new THREE.MeshLambertMaterial({
		opacity: 0.4,
	    color: 0xB20000,
	    transparent: true,
	    side: THREE.DoubleSide
	})

	var fanGeometry = new THREE.CubeGeometry(300, 200, 400);
	var fanMesh = new Physijs.BoxMesh(fanGeometry, fanMaterial, 0); //Gravity, 0 = weightless

	fanMesh.position.set(position.x, position.y, position.z);
	fanMesh._physijs.collision_flags = 4;	//Allows collision detection, but doesn't affect velocity etc. of object colliding with it
	fanMesh.mode = paramMode;
	fans.push(fanMesh);

	scene.add(fanMesh);


	//-------------------------------------------------------//
}

function handleCollision(collided_with, linearVelocity, angularVelocity) {
	//Event gets called when physics objects (spheres) collide with another object
	for (var i = 0; i < fans.length; i++) {
		if (collided_with.id === fans[i].id) {
			//Collided with fan
			if ( fans[i].mode === "intake" ) {
				var forceVector = new THREE.Vector3(0, 500000, 1000000); 	//Force/Impulse is quantified by units pushing in a 3 axis directions. NOTE: A really big number is needed to produce any noticeable affect
			} else if (fans[i].mode === "exhaust" ) {
				var forceVector = new THREE.Vector3(0, 0, 1000000); 	//Force/Impulse is quantified by units pushing in a 3 axis directions. NOTE: A really big number is needed to produce any noticeable affect
			}			
			this.applyCentralImpulse(forceVector);
		}
	}
}

function handleMouseMove( event ) {
	//Event gets called when the mouse moves, it creates a ray to detect what (if any) objects the mouse is touching
	//If it detects the mouse is touching a fan, it will load the control panel section for that fan for easy access

	//Have to normalise these coords sothat they are between -1 and 1
	mouse.x = ( ( event.clientX / width ) * 2 - 1) - 0.5;	//Have to -0.5 because the control panel messes up the range, -0.5 is a temp fix, when the control panel size changes, the modifier should change programmatically 
	mouse.y = - ( event.clientY / height ) * 2 + 1;

	console.log("Mouse x: " + mouse.x);
	console.log("Mouse y: " + mouse.y);

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( fans, true );

	if ( intersects.length > 0 ) {

		intersectedObject = intersects[0];
		intersectedObject.object.material.color.setHex( 0x00FF00 );

		//TODO: onClick (or on mouse over) load up the control panel section for this particular fan

	} 
}

function restartSim() {
	//Removes all existing physics objects from the scene, then generates new physics objects
	for (var i=0; i < objects.length; i++) {
		 if(objects[i] != null) {
			scene.remove(objects[i]);
		}
	}
	//animate();
	createObjects(50);
}

function onWindowResize(){
	//Dynamically resizes renderer and camera when window is resized

	width = document.getElementById('simulationContainer').offsetWidth;
	height = document.getElementById('simulationContainer').offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}

function debugaxis(axisLength){
	/*
		Code written by http://nooshu.com/debug-axes-in-three-js
	*/
	//X = RED, Y = GREEN, Z = BLUE

    //Shorten the vertex function
    function v(x,y,z){
            return new THREE.Vector3(x,y,z);
    }
   
    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
    }
   
    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};


//TODO:
// - Maybe use an eventListener for when $scope changes instead of checking every update frame -> better for perfomance