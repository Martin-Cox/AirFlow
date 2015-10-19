var camera, scene, renderer, width, height, clock, orbitControl, fpsStats;
var objects = [];

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

	scene.setGravity(new THREE.Vector3( 0, 12, 25));

	createObjects(50);


	/*-CREATE COMPUTER CASE */

	var caseGroup = new THREE.Object3D(); //Empty container to store each case plane in

	var caseMaterial = new THREE.MeshLambertMaterial({
		color: 0x5F6E7D
	})

	var transparentMaterial = new THREE.MeshBasicMaterial({ 
	    opacity: 0.4,
	    color: 0x5F6E7D,
	    transparent: true
	});

	var componentMaterial = new THREE.MeshLambertMaterial({
		color: 0xD5D3D0
	})

	var caseWidth = 350;
	var caseHeight = 800;
	var caseLength = 900;
	var caseThickness = 4;
	var fanHoleSize = 200;

	var caseBottomGeometry = new THREE.CubeGeometry(caseWidth, caseLength, caseThickness);
	var caseTopGeometry = new THREE.CubeGeometry(caseWidth, caseLength, caseThickness);
	var caseVisibleSideGeometry = new THREE.CubeGeometry(caseLength, caseHeight, caseThickness);
	var caseInvisibleSideGeometry = new THREE.CubeGeometry(caseLength, caseHeight, caseThickness);
	var caseBackGeometry = new THREE.CubeGeometry(caseWidth, caseHeight - fanHoleSize, caseThickness);
	var caseFrontGeometry = new THREE.CubeGeometry(caseWidth, caseHeight - fanHoleSize, caseThickness);

	var gpuGeometry = new THREE.CubeGeometry(caseWidth - 100, 375, 25);

	var caseBottomPlane = new Physijs.BoxMesh(caseBottomGeometry, caseMaterial, 0); //Gravity, 0 = weightless
	var caseTopPlane = new Physijs.BoxMesh(caseTopGeometry, caseMaterial, 0); //Gravity, 0 = weightless
	var caseVisibleSidePlane = new Physijs.BoxMesh(caseVisibleSideGeometry, caseMaterial, 0); //Gravity, 0 = weightless
	var caseInvisibleSidePlane = new Physijs.BoxMesh(caseInvisibleSideGeometry, transparentMaterial, 0); //Gravity, 0 = weightless
	var caseBackPlane = new Physijs.BoxMesh(caseBackGeometry, caseMaterial, 0); //Gravity, 0 = weightless
	var caseFrontPlane = new Physijs.BoxMesh(caseFrontGeometry, caseMaterial, 0); //Gravity, 0 = weightless

	var gpuPlane = new Physijs.BoxMesh(gpuGeometry, componentMaterial, 0); //Gravity, 0 = weightless

	caseBottomPlane.rotation.x = Math.PI / 2;
	caseBottomPlane.position.set(0, 0, 0);

	caseTopPlane.rotation.x = Math.PI / 2;
	caseTopPlane.position.set(0, caseHeight, 0);

	caseVisibleSidePlane.rotation.y = Math.PI / 2;
	caseVisibleSidePlane.position.set(-caseWidth/2, caseHeight/2, 0);

	caseInvisibleSidePlane.rotation.y = Math.PI / 2;
	caseInvisibleSidePlane.position.set(caseWidth/2, caseHeight/2, 0);

	caseBackPlane.position.set(0, caseHeight/2 - (fanHoleSize/2), caseLength/2);

	caseFrontPlane.position.set(0, caseHeight/2 + (fanHoleSize/2), -caseLength/2);

	gpuPlane.rotation.x = Math.PI / 2;
	gpuPlane.position.set(-45, caseHeight/2 - 100, 200);

	scene.add(caseBottomPlane);
	scene.add(caseTopPlane);
	scene.add(caseVisibleSidePlane);
	scene.add(caseInvisibleSidePlane);
	scene.add(caseBackPlane);
	scene.add(caseFrontPlane);
	scene.add(gpuPlane);


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


	var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
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

		object.castShadow = true;

		scene.add(object);

		objects.push(object);
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