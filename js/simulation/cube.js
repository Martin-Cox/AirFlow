var camera, scene, renderer, width, height, clock, orbitControl;
var cubes = [];

init();
animate();

function init() {

	window.addEventListener( 'resize', onWindowResize, false);

	width = document.getElementById('simulationContainer').offsetWidth;
	height = document.getElementById('simulationContainer').offsetHeight;

	renderer = new THREE.WebGLRenderer ( { antialias: true});
	renderer.setSize(width, height);
	document.getElementById("simulationContainer").appendChild(renderer.domElement);

	scene = new THREE.Scene;


	for (var i=0; i < 500; i++) {
		var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

		var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xD9216A });

		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		cube.position.set((( Math.random() - 0.5 ) * 1000), (( Math.random() - 0.5 ) * 1000), (( Math.random() - 0.5 ) * 1000));

		cube.rotation.y = Math.PI * 45 / 180;

		cube.castShadow = true;

		scene.add(cube);

		cubes.push(cube);
	}


	camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);

	camera.position.y = 160;
	camera.position.z = 400;

	//camera.lookAt(cubes[1].position);

	scene.add(camera);

	orbitControl = new THREE.OrbitControls(camera);
	orbitControl.enableZoom = false;
	clock = new THREE.Clock();


	var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x262B30, side: THREE.BackSide });
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

	scene.add(skybox);


	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 300, 200);

	scene.add(pointLight);	
}

function animate() {

	requestAnimationFrame(animate);

	for (var i=0; i < 500; i++) {
		cubes[i].rotation.x += 0.01;
		cubes[i].rotation.y += 0.01;
	}

	var delta = clock.getDelta();
	orbitControl.update(delta);

	renderer.render(scene, camera);
}

function onWindowResize(){

	width = document.getElementById('simulationContainer').offsetWidth;
	height = document.getElementById('simulationContainer').offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}