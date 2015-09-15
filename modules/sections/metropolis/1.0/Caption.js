'use strict'

var Control		= require('ui/control')

var Caption = Control.inherit({

	controlName: 'caption',
	// noWrap: true,

    onInit: function(caption, upgrading, total, elapsed) {

        this.y = this.x = -10000

    	this.caption = caption
    	this.upgrading = upgrading ? true : false
    	if(this.upgrading) {
    		this.total = total
    		this.elapsed = elapsed
    	}

    },

	setUpgrade: function(total, elapsed) {
    	if(!this.upgrading || total !== this.total || elapsed !== this.elapsed) {
    		this.upgrading = true
	    	this.total = total
    		this.elapsed = elapsed
    		this.rePlace()
		}
    	this.show()
	},

    setCaption: function(caption) {
    	if(caption !== this.caption) {
	    	this.caption = caption
    		this.rePlace()
		}
    	this.show()
    },

    setXY: function(x, y) {
    	if(x !== this.x || y !== this.y) {
	    	this.x = x
    		this.y = y
    		this.rePlace()
		}
    	this.show()
    },

    /*
    hide: function() {
    },
    */

	render: function() {
		if(this.upgrading) {
			var elapsed = this.elapsed / this.total * 100
			return require('CaptionUpgrading.html')({ x: this.x, y: this.y, caption: this.caption, elapsed: elapsed, p: '%' })
		}
		return require('Caption.html')({ x: this.x, y: this.y, caption: this.caption })
	}
})

module.exports = Caption
