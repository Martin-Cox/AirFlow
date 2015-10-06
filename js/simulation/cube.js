var camera, scene, renderer, cube, width, height;

init();
animate();

function init() {

	window.addEventListener( 'resize', onWindowResize, false);

	width = document.getElementById('simulationContainer').offsetWidth;
	height = document.getElementById('simulationContainer').offsetHeight - 50; 		//REMOVE "-50" from HEIGHT AFTER REMOVE "Main Simulation goes here text"

	renderer = new THREE.WebGLRenderer ( { antialias: true});
	renderer.setSize(width, height);
	document.getElementById("simulationContainer").appendChild(renderer.domElement);

	scene = new THREE.Scene;



	var cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
	var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

	cube.rotation.y = Math.PI * 45 / 180;

	scene.add(cube);



	camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);

	camera.position.y = 160;
	camera.position.z = 400;

	camera.lookAt(cube.position);

	scene.add(camera);


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

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

function onWindowResize(){

	width = document.getElementById('simulationContainer').offsetWidth;
	height = document.getElementById('simulationContainer').offsetHeight - 50; 		//REMOVE "-50" from HEIGHT AFTER REMOVE "Main Simulation goes here text"

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}