
var Control		= require('ui/control')

var Menu = Control.inherit({

	controlName: 'menu-side-navigate',

    onInit: function() {
    	this.items = [ ];
    },

	setItems: function(items) {
		this.items = items;
		this.rePlace();
	},

	render: function() {
		return require('menu.html')({ items: this.items })
	},

	setGuestMenu: function() {
		this.setItems([
			{ title: 'About the game', hash: '' }
		])
	},

	setUserMenu: function() {
		this.setItems([
			{ title: 'Start', hash: 'start' },
			{ title: 'Profile', hash: 'profile' },
			{ title: 'About the game', hash: '' }
		])
	},

	setPlayerMenu: function() {
		this.setItems([
			{ title: 'Metropolis', hash: 'metropolis' },
			{ title: 'Profile', hash: 'profile' },
			{ title: 'About the game', hash: '' }
		])
	}
})

module.exports = Menu
