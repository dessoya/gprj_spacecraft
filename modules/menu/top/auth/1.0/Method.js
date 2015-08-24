
var Control		= require('ui/control')
  , config		= require('config')

var Method = Control.inherit({

	controlName: 'method',

    onInit: function(name, connection) {
        this.connection = connection
    	this.name = name
    },

	render: function() {
		return require('Method.html')({ name: this.name })
	},

	onClick: function(event) {
	    event.preventDefault();
	    this.connection.close();
	    // var url = config.auth.service_path + '/api/' + this.name + '?session_uuid=' + window.session_uuid + '&success=' + encodeURIComponent('/?page=auth_success');
		var url = config.auth.service_path + '/api/' + this.name + '?session_uuid=' + window.session_uuid; // + '&success=' + encodeURIComponent('http://192.168.88.21:9400/api/auth/success');
		// console.log(url)
		document.location = url;
	}

})

module.exports = Method
