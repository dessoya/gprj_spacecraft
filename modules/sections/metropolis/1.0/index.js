
var Class = require('class')

var Section = Class.inherit({

    pattern: 'metropolis',

	onCreate: function(viewSelector, connection) {
		this.connection = connection;
		this.viewSelector = viewSelector;

		this.binded_render = this.render.bind(this);
	},

	activate: function() {

		this.connection.send({ command: "set_section", section: "metropolis" })

		var self = this
		this.connection.sendWithFeedBack({ command: 'get_planet' }, function(err, message) {

		
		})

		document.querySelector(this.viewSelector).innerHTML = ''

		this.raycaster = new THREE.Raycaster();

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(35, 700 / 400, 0.1, 1000);

		this.renderer = new THREE.WebGLRenderer(); // {antialias:true}
		this.renderer.setClearColor(0x0, 1.0);
		this.renderer.setSize(700, 400);
		this.renderer.shadowMapEnabled = true;
		document.querySelector(this.viewSelector).appendChild( this.renderer.domElement );

		var planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
		var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.plane = new THREE.Mesh(planeGeometry,planeMaterial);
		this.plane.receiveShadow  = true;
		// rotate and position the plane

		this.plane.rotation.x=-0.5*Math.PI;
		this.plane.rotation.z=0; //0.6*Math.PI;

		this.plane.position.x=0
		this.plane.position.y=0
		this.plane.position.z=0
		this.scene.add(this.plane);

		var ambientLight = new THREE.AmbientLight(0x3c3c3c);
		this.scene.add(ambientLight);

		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 0, 60, 60 );
		spotLight.castShadow = true;
		this.scene.add( spotLight );

		this.camera.position.x = 30;
		this.camera.position.y = 30;
		this.camera.position.z = 50;
		this.camera.lookAt(this.scene.position);

		this.render()

	},

	render: function() {

	    // scene.traverse(function(e) {
    	   //  if (e instanceof THREE.Mesh && e != plane && e._selected) {
        	//     e.rotation.y+=controls.rotationSpeed;
/*          	  e.rotation.y+=controls.rotationSpeed;
	            e.rotation.z+=controls.rotationSpeed;
*/  	
	//        }
	//    });

		this.requestId = requestAnimationFrame( this.binded_render );

    	// requestAnimationFrame(this.binded_render);
	// raycaster = projector.pickingRay( mouse2D.clone(), camera );

/*
	raycaster.far = 200;
	raycaster.near = 200;
	raycaster.precision = 20;
*/
	    this.renderer.render(this.scene, this.camera);
	},


	deactivate: function() {
		cancelAnimationFrame(this.requestId);
		document.querySelector(this.viewSelector).innerHTML = ''
	}
})

module.exports = Section