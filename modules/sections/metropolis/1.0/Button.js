
var Control		= require('ui/control')

var Button = Control.inherit({

	controlName: 'button',

    onInit: function(caption, clickCallback) {
    	this.caption = caption
    	this.clickCallback = clickCallback
    },

	render: function() {
		return require('Button.html')({ caption: this.caption })
	},

	onClick: function() {
		this.clickCallback()
	}
})

module.exports = Button
