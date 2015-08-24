
var Class = require('class')

var Section = Class.inherit({

    pattern: [ 'main', 'about' ],

	onCreate: function(viewSelector, connection) {
		this.connection = connection;
		this.viewSelector = viewSelector;
	},

	activate: function() {
		document.querySelector(this.viewSelector).innerHTML = 'The game . . .'
		this.connection.send({ command: "set_section", section: "about" })
	},

	deactivate: function() {
		document.querySelector(this.viewSelector).innerHTML = ''
	}
})

module.exports = Section