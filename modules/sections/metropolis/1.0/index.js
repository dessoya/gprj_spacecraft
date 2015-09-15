
var Class					= require('class')
  , BuildingContorlMenu		= require('BuildingContorlMenu.js')
  , Button					= require('Button.js')
  , Caption					= require('Caption.js')
  , CaptionManager			= require('CaptionManager.js')
  , ResourceInfo			= require('ResourceInfo.js')

var Section = Class.inherit({

    pattern: 'metropolis',

    bcolors: {
    	capital: 0xff3333,
    	energy_station: 0x33ff33,
    	mineral_mine: 0x33ffff,
    },

	onCreate: function(viewSelector, connection) {
		this.connection = connection;
		this.viewSelector = viewSelector;
	    this.buildingControlMenu = BuildingContorlMenu.create(this);

	    this.resourceInfo = ResourceInfo.create();
	    this.captionManager = CaptionManager.create();

		this.binded_render = this.render.bind(this);
		this.binded_onBuildSS = this.onBuildSS.bind(this);
		this.binded_onResourceChanges = this.onResourceChanges.bind(this)
		this.binded_onBuildingProgress = this.onBuildingProgress.bind(this)
		this.binded_onBuildingUpgradeCompleted = this.onBuildingUpgradeCompleted.bind(this)
	},

	addBuildingToScene: function(b) {

		var x = b.x * 5, y = b.y * 5, type = b.type;

		var cubeSize = 5;
	    var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

		var cube = new THREE.Mesh(cubeGeometry, new THREE.MeshLambertMaterial( { color: this.bcolors[type], wireframe: false  } ));

	    cube.castShadow = true;

	    cube.position.x = x;
	    cube.position.y = cubeSize / 2;
	    cube.position.z = y;

	    cube.rotation.x = cube.rotation.y = cube.rotation.z = 0;

	    cube._sc_type = 'building';
	    cube._sc_id = 'bld_' + x + '_' + y;

	    this.scene.add(cube);
	    this.renderer.render(this.scene, this.camera);

		b.object = cube;
		this.buildingsMapXY[cube._sc_id] = b;
		this.buildingsMapUUID[b.uuid] = b;

		if(b.upgrade_in_progress) {
			// console.log(b)
			var caption = this.captionManager.add(cube._sc_id)
    		caption.setCaption(this.makeBuildingCaption(cube))
			var hp = this.getObjectCaptionPosition(cube);
			caption.setXY(hp.x, hp.y)			
			caption.setUpgrade(b.upgrade_duration, b.upgrade_elapsed)
		}

	    return cube
	},

	onBuildingProgress: function(command, message) {

		// console.log(message)

		var b = this.buildingsMapUUID[message.building.uuid]
		// console.log(b)

		var o = b.object
		var caption = this.captionManager.add(o._sc_id)
   		caption.setCaption(this.makeBuildingCaption(o))
		var hp = this.getObjectCaptionPosition(o);
		caption.setXY(hp.x, hp.y)			
		b.upgrade_duration = message.building.upgrade_duration
		b.upgrade_elapsed = message.building.upgrade_elapsed
		caption.setUpgrade(b.upgrade_duration, b.upgrade_elapsed)
	},

	onBuildingUpgradeCompleted: function(command, message) {

		// console.log(message)

		var b = this.buildingsMapUUID[message.building.uuid]
		// console.log(b)

		var o = b.object
		var caption = this.captionManager.add(o._sc_id)
		b.upgrade_duration = 0
		b.upgrade_elapsed = 0
		b.level = message.building.level
		caption.upgrading = false
   		caption.setCaption(this.makeBuildingCaption(o))
		var hp = this.getObjectCaptionPosition(o);
		caption.setXY(hp.x, hp.y)			
		// caption.setUpgrade(b.upgrade_duration, b.upgrade_elapsed)
	},

	setupNoneMode: function() {
		this.mode = 'none'
		this.rollOverMesh.position.y = 10000

		// this.hideCaption('construct')

		this.renderer.render(this.scene, this.camera);		
	},

	setupConstructMode: function(building) {
		this.modeBuilding = building
		this.rollOverMesh.material.color.setHex( this.bcolors[building] );
		this.mode = 'ConstructMode'
	},

	onBuildSS: function(command, message) {

	    // console.log('onBuildSS')
	    // todo: check message.planet_uuid with current planet_uuid
	    var b = message.building;
	    // b.level = 1;
		this.buildings.push(b)
		this.addBuildingToScene(b)
	},

	onResourceChanges: function(command, message) {
		var r = message.resources
		for(var key in r) {
			this.resourceInfo[key] = r[key]
		}
	},

	onMouseDown: function(event) {
	
	    if(this.mode == 'ConstructMode') {
			var self = this
			this.connection.send({ command: 'build', building: this.modeBuilding, x: this.selectX, y: this.selectY })
			this.setupNoneMode()
	    }
	},

	onMouseMove: function(event) {

		this.mouse2D.x = ( (event.clientX - this.renderer.domElement.parentNode.offsetLeft) / this.renderer.domElement.width ) * 2 - 1;
		this.mouse2D.y = - ( (event.clientY - this.renderer.domElement.parentNode.offsetTop) / this.renderer.domElement.height ) * 2 + 1;

		this.raycaster.setFromCamera( this.mouse2D, this.camera );	

	    if(this.mode == 'ConstructMode') {
	
			var intersects = this.raycaster.intersectObjects( [ this.plane ] );

			if ( intersects.length > 0 ) {
				var intersect = intersects[ 0 ];
			
				var p = new THREE.Vector3( 0, 10000, -10 );
				p.copy( intersect.point ).add( intersect.face.normal );
				p.divideScalar( 5 ).floor().multiplyScalar( 5 );
				// console.log(p.x, p.z);

				this.rollOverMesh.position.x = p.x
				this.rollOverMesh.position.y = 2.5
				this.rollOverMesh.position.z = p.z

				this.selectX = p.x / 5
				this.selectY = p.z / 5

				this.renderer.render(this.scene, this.camera);

				var hp = this.getObjectCaptionPosition(this.rollOverMesh);

				// this.addCaption('construct', hp.x, hp.y, 'build: ' + this.modeBuilding + '<br />x ' + this.selectX + ', y ' + this.selectY)

				var exists = false
				for(var i = 0, c = this.buildings, l = c.length; i < l; i++) {
					var b = c[i]
					if(b.x == this.selectX && b.y == this.selectY) {
					    exists = true
						break
					}
				}
				this.buildAllowed = !exists
				this.setCursor(exists ? 'not-allowed' : 'copy')

			}
		}


	    if(this.mode == 'ConstructMode') {
	    	return
	    }

		var intersects = this.raycaster.intersectObjects( this.scene.children );
		var hoverObject = null, hp, ho

		if ( intersects.length > 0 ) {		
	
		    for(var i = 0, c = intersects, l = c.length; i < l; i++) {
	    		var item = c[i].object
	    		if(item._sc_type) {
	    			if(item._sc_type == 'building') {

						hp = this.getObjectCaptionPosition(item)

						hoverObject = item._sc_id
						ho = item
						break;
	    			
		    		}
		    	}
	    	}
	
    	}

	    if(this.hoverObject != hoverObject) {

	    	if(this.hoverObject) {
	    		var caption = this.captionManager.get(this.hoverObject)
	    		if(caption && !caption.upgrading) {
	    			caption.hide()
				}
	    	}

	    	this.hoverObject = hoverObject
	    	this.ho = ho
	    	if(this.hoverObject) {
	    		var caption = this.captionManager.add(this.hoverObject)
	    		caption.setCaption(this.makeBuildingCaption(this.ho))
				caption.setXY(hp.x, hp.y)

	    		this.setCursor('pointer')
	    	}
	    	else {
	    		this.setCursor('default')
	    	}
	    }

	},

	makeBuildingCaption: function(object) {
		var b = this.buildingsMapXY[object._sc_id]
		var text = b.type
		if(b.level > 0) {
			text += '<br>level ' + b.level
		}
		else {
			text += '<br>constructing'
		}
		return text
	},

	getObjectCaptionPosition: function(object) {

		var vector = new THREE.Vector3();

		var widthHalf = 0.5 * this.renderer.context.canvas.width;
    	var heightHalf = 0.5 * this.renderer.context.canvas.height;

		object.updateMatrixWorld();
		vector.setFromMatrixPosition(object.matrixWorld);
		vector.project(this.camera);

		vector.x = ( vector.x * widthHalf ) + widthHalf;
		vector.y = - ( vector.y * heightHalf ) + heightHalf;

		var vector2 = new THREE.Vector3();
		vector2.setFromMatrixPosition(object.matrixWorld);
		vector2.y += 6
		vector2.project(this.camera);

		vector2.x = ( vector2.x * widthHalf ) + widthHalf;
		vector2.y = - ( vector2.y * heightHalf ) + heightHalf;

		var d = vector.y - vector2.y

		return {
			x: vector.x - d / 2 + this.renderer.domElement.parentNode.offsetLeft,
			y: vector.y - d + this.renderer.domElement.parentNode.offsetTop
		}
	},

	onGetPlanet: function(err, message) {

		var p = message.planet_info

		this.resourceInfo.population = p.population
		this.resourceInfo.population_avail = p.population_avail
		this.resourceInfo.minerals = p.minerals
		this.resourceInfo.crystals = p.crystals

		this.buildings = p.buildings
		for(var i = 0, c = p.buildings, l = c.length; i < l; i++) {
		    var b = c[i];
			var o = this.addBuildingToScene(b);
		}
	},

	activate: function() {

	    // this.captions = { };
	    this.captionManager.clear();
	    this.hoverObject = 'none'

	    this.buildings = [ ];
	    this.buildingsMapXY = { };
	    this.buildingsMapUUID = { };

		this.mode = 'none';

	    this.buildingControlMenu.init();
	    this.buildingControlMenu.place('#second_menu');

		// this.resourceInfo.population = this.resourceInfo.minerals = this.resourceInfo.crystals = -1	    
		this.resourceInfo.reset()

		this.connection.send({ command: "set_section", section: "metropolis" })

		var self = this
		this.connection.sendWithFeedBack({ command: 'get_planet' }, this.onGetPlanet.bind(this));

		this.connection.on('nc_build', this.binded_onBuildSS)
		this.connection.on('nc_update_planet_resource', this.binded_onResourceChanges)

		this.connection.on('nc_update_building_progress', this.binded_onBuildingProgress)
		this.connection.on('nc_building_upgrade_completed', this.binded_onBuildingUpgradeCompleted)
		

		var html = '<div id="scene_cont" style="position:relative">';
		html += '<div style="position:absolute; left: 10px; top: 10px" id="left_turn_button_cont">&nbsp;</div>';
		html += '<div style="position:absolute; left: 40px; top: 10px" id="right_turn_button_cont">&nbsp;</div>';
		html += '<div style="position:absolute; left: 80px; top: 10px" id="res_info"></div>';
		html += '</div>';
		// view_cont.innerHTML = html;

		document.querySelector(this.viewSelector).innerHTML = html

		this.resourceInfo.place('#res_info')

		var b = Button.create('<', function() {
		    // if(self.plane._rotation_to.z != self.plane.rotation.z) return
			self.plane._rotation_to.z -= 0.5 * Math.PI
		})
		b.place('#left_turn_button_cont')

		b = Button.create('>', function() {
		    // if(self.plane._rotation_to.z != self.plane.rotation.z) return
			self.plane._rotation_to.z += 0.5 * Math.PI
		})
		b.place('#right_turn_button_cont')

		this.mouse2D = new THREE.Vector3( 0, 10000, -10 );
		this.raycaster = new THREE.Raycaster();


		this.raycaster = new THREE.Raycaster();

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, 780 / 500, 1, 2000);

		this.renderer = new THREE.WebGLRenderer(); // {antialias:true}
		this.renderer.setClearColor(0x0, 1.0);
		this.renderer.setSize(780, 500);
		this.renderer.shadowMapEnabled = true;
		document.getElementById('scene_cont').appendChild( this.renderer.domElement );

		this.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove.bind(this) )
		this.renderer.domElement.addEventListener( 'mousedown', this.onMouseDown.bind(this) )
		

		var planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
		var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.plane = new THREE.Mesh(planeGeometry,planeMaterial);
		this.plane.receiveShadow  = true;
		// rotate and position the plane

		this.plane.rotation.x = -0.5 * Math.PI;
		this.plane.rotation.z = 0;
		this.plane.rotation.y = 0;

		this.plane.position.x = this.plane.position.y = this.plane.position.z = 0

		// this.plane._rotation_to = { z: 0.5 * Math.PI };
		this.plane._rotation_to = { z: 0.25 * Math.PI, zt: 0.25 * Math.PI };

		this.scene.add(this.plane);

		var ambientLight = new THREE.AmbientLight(0x3c3c3c);
		this.scene.add(ambientLight);

		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 0, 60, 60 );
		spotLight.castShadow = true;
		this.scene.add( spotLight );

    	this.setupCameraAngle(this.plane._rotation_to.zt)

		this.camera.lookAt(this.scene.position);

		var rollOverGeo = new THREE.BoxGeometry( 7, 7, 7 );
		var rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff8800, opacity: 0.5, transparent: true } );
		this.rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
		this.rollOverMesh.position.x=5
		this.rollOverMesh.position.y=1000
		this.rollOverMesh.position.z=5
		this.scene.add( this.rollOverMesh );


		this.renderer.render(this.scene, this.camera);
		this.render()

	},

	setupCameraAngle: function(angle) {

		var position = this.camera.position;
	        
	    var offset = new THREE.Vector3( 0, 0, 0 );

		offset.x = 70 * Math.sin( angle );
		offset.y = 30	
		offset.z = 70 * Math.cos( angle );

		position.copy( this.scene.position ).add( offset );

		this.camera.lookAt( this.scene.position );
	},


	render: function() {

		this.requestId = requestAnimationFrame( this.binded_render );

	    if(this.plane._rotation_to.z != this.plane._rotation_to.zt) {
	                        
	    	var d = this.plane._rotation_to.z - this.plane._rotation_to.zt;
	    	var step = 0.03;
	    	if(d > 0) {
	    		if(d < step) {
	    			this.plane._rotation_to.zt = this.plane._rotation_to.z;
	    		}
	    		else {
	    			this.plane._rotation_to.zt += step;
	    		}
	    	}
	    	else {
	    		if(-1 * d < step) {
	    			this.plane._rotation_to.zt = this.plane._rotation_to.z;
	    		}
	    		else {
	    			this.plane._rotation_to.zt -= step;
	    		}
	    	}

	    	this.setupCameraAngle(this.plane._rotation_to.zt)
	    	this.renderer.render(this.scene, this.camera);

			if(this.hoverObject) {

				var hp = this.getObjectCaptionPosition(this.ho)
				// this.addCaption(this.hoverObject, hp.x, hp.y, this.makeBuildingCaption(this.ho))

			}
	    }

	    // this.renderer.render(this.scene, this.camera);

	},

	/*

	hideCaption: function(id) {

		if(id in this.captions) {
			this.captions[id].state = false;
			document.getElementById('caption_' + id).style.display = 'none';
		}

	},

	addCaption: function(id, x, y, caption) {

		if(!(id in this.captions)) {
			var item = this.captions[id] = { x: 100000, y: 100000, state: true }
			var el = item.el = document.createElement('div')
			
			el.setAttribute('id', 'caption_' + id)
			el.style.position = 'absolute'

			 el.style.left = (x + this.renderer.domElement.parentNode.offsetLeft) + 'px'
			 el.style.top = (y + this.renderer.domElement.parentNode.offsetTop) + 'px'
			// el.style.left = (x) + 'px'
			// el.style.top = (y) + 'px'

			el.classList.add('building_caption')
			item.caption = el.innerHTML = caption ? caption : 'Capital<br>level 1'
			document.querySelector(this.viewSelector).appendChild(el)

		}

		var item = this.captions[id];
		if(x != item.x || y != item.y) {
			item.x = x
			item.y = y
			// console.log(id, x, y)
			var el = document.getElementById('caption_' + id)

			el.style.left = (x + this.renderer.domElement.parentNode.offsetLeft) + 'px'
			el.style.top = (y + this.renderer.domElement.parentNode.offsetTop) + 'px'
		}

		if(item.state == false) {
			item.state = true
			document.getElementById('caption_' + id).style.display = 'block'
		}

		if(caption && item.caption != caption) {
			item.el.innerHTML = item.caption = caption
		}

	},

	*/

	setCursor: function(cursor) {
		document.querySelector(this.viewSelector).style.cursor = cursor
	},


	deactivate: function() {
	    this.captionManager.clear();
		cancelAnimationFrame(this.requestId);
		this.resourceInfo.remove();
		document.querySelector(this.viewSelector).innerHTML = '';
		this.buildingControlMenu.remove();
	}
})

module.exports = Section