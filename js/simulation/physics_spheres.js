var camera, scene, renderer, width, height, clock, orbitControl, fpsStats;
var objects = [];

init();
animate();

function init() {

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

	scene.setGravity(new THREE.Vector3( 0, 25, 50));

	for (var i=0; i < 50; i++) {

		var object;

		if (Math.random() > 0.5) {
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
		} else {
			var randNum = Math.random();
			var matColor;

			if (randNum < 0.34) {
				matColor = 0xD9216A;
			} else if (randNum > 0.34 && randNum < 0.67) {
				matColor = 0x18ABDB;
			} else {
				matColor = 0x18DB3F;
			}

			var boxGeometry = new THREE.BoxGeometry(20, 20, 20);

			var boxMaterial = Physijs.createMaterial(
	          new THREE.MeshLambertMaterial({
	            color: matColor
	          }),
		      0.3, // friction
		      0.9 // restitution
	        );

			object = new Physijs.BoxMesh(boxGeometry, boxMaterial);
		}		

		object.position.set((( Math.random() - 0.5 ) * 400), (( Math.random()) * 300), (( Math.random() - 1 ) * 300));

		object.rotation.y = Math.PI * 45 / 180;

		object.castShadow = true;

		scene.add(object);

		objects.push(object);
	}

	var planeGeometry_A = new THREE.CubeGeometry(600, 600, 2);
	var planeGeometry_B = new THREE.CubeGeometry(600, 600, 2);

	var groundPlaneTexture = new THREE.ImageUtils.loadTexture('images/grass.png'); 
	groundPlaneTexture.anisotropy = renderer.getMaxAnisotropy();

	var groundPlaneMaterial = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ 
        map: groundPlaneTexture,
        side: THREE.DoubleSide
      }),
      0.5, // friction
      0.6 // restitution
    );

	groundPlane_A = new Physijs.BoxMesh(planeGeometry_A, groundPlaneMaterial, 0); //Gravity, 0 = weightless
	groundPlane_B = new Physijs.BoxMesh(planeGeometry_B, groundPlaneMaterial, 0); //Gravity, 0 = weightless
	    
	groundPlane_A.position.set(0, 0, 0);
	groundPlane_B.position.set(0, 325, 100);

	groundPlane_A.rotation.x = 10;
	groundPlane_B.rotation.x = 250;

	scene.add(groundPlane_A);
	scene.add(groundPlane_B);

	camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);

	camera.position.y = 400;
	camera.position.z = -800;

	camera.lookAt(groundPlane_A.position);

	scene.add(camera);

	orbitControl = new THREE.OrbitControls(camera, document.getElementById('simulationContainer'));
	orbitControl.enablePan = false;
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
}

function animate() {

	fpsStats.begin();

	scene.simulate(); //Run physics simulation

	requestAnimationFrame(animate);
	var delta = clock.getDelta();
	orbitControl.update(delta);

	renderer.render(scene, camera);

	fpsStats.end();
}

function onWindowResize(){

	width = document.getElementById('simulationContainer').offsetWidth;
	height = document.getElementById('simulationContainer').offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}
