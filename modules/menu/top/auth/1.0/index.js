
var Control		= require('ui/control')
  , Method		= require('Method.js')

var Menu = Control.inherit({

	controlName: 'menu-top-auth',

    onInit: function(connection, is_auth, methods, user) {
    	this.connection = connection
    	this.is_auth = is_auth
    	this.user = user
    	this.methods = methods;
    	this.methodElements = [];
    	for(var i = 0, l = methods.length; i < l; i++) {
    		this.methodElements.push(Method.create(methods[i], connection))
    	}
    },

	render: function() {
		if(this.is_auth) {
			return require('authMenu.html')({ user: this.user })
		}

		return require('menu.html')({ methods: this.methods })
	},

	placeMethod: function(placeholder, index) {
		this.methodElements[index].place(placeholder, true)
	},

	onLogout: function(event) {
	    event.preventDefault();
	    this.connection.send({ command: "logout" })
	}

})

module.exports = Menu
