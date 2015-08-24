
var Class = require('class')

var Section = Class.inherit({

    pattern: 'start',

	onCreate: function(viewSelector, connection, nm) {
		this.connection = connection;
		this.viewSelector = viewSelector;
		this.nm = nm;
	},

	activate: function() {
		document.querySelector(this.viewSelector).innerHTML = ''
		var self = this
		this.connection.sendWithFeedBack({ command: 'start' }, function(err, message) {
			console.log('on started')
			document.querySelector(self.viewSelector).innerHTML = 'started'
			self.nm.setPlayerMenu()
		})
	},

	deactivate: function() {
		document.querySelector(this.viewSelector).innerHTML = ''
	}
})

module.exports = Section