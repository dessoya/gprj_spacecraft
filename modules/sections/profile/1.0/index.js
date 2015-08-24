
var Class = require('class')

var Section = Class.inherit({

    pattern: 'profile',

	onCreate: function(viewSelector, connection) {
		this.connection = connection;
		this.viewSelector = viewSelector;
	},

	activate: function() {
		document.querySelector(this.viewSelector).innerHTML = 'Profile'
		this.connection.send({ command: "set_section", section: "profile" })
	},

	deactivate: function() {
		document.querySelector(this.viewSelector).innerHTML = ''
	}
})

module.exports = Section