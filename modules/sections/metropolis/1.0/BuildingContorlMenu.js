
var Control		= require('ui/control')

var Menu = Control.inherit({

	controlName: 'menu-building-control',

    onInit: function(section) {
    	this.section = section;
    },

    init: function() {
    	this.mode = 'commands'
    },

	render: function() {
		switch(this.mode) {
		case 'commands':
			return require('BuildingContorlMenu_Commands.html')({ })
		case 'buildings':
			return require('BuildingContorlMenu_Buildings.html')({ items: this.items })
		}
		return ''
	},

	back2commands: function(event) {
	    event.preventDefault();

	    this.section.setupNoneMode();

		this.mode = 'commands';
		this.rePlace();
	},

	onBuild: function(event) {
	    event.preventDefault();
		// console.log('onBuild')

		var self = this
		this.section.connection.sendWithFeedBack({ command: 'get_planet_buildings_for_construct' }, function(err, message) {
			// console.log(message)
			self.mode = 'buildings';
			self.items = message.buildings;
			self.rePlace();

		})

	},

	build: function(event, building) {
	    event.preventDefault();

	    this.section.setupConstructMode(building);
	}

})

module.exports = Menu
