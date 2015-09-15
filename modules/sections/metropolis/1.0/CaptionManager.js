'use strict'

var Class				= require('class')
  , Caption				= require('Caption.js')

var CaptionManager = Class.inherit({

	onCreate: function() {
		this.captions = { }
	},

	get: function(id) {
		if(id in this.captions) {
			return this.captions[id]
		}
		return null
	},

	clear: function() {
		for(var id in this.captions) {
			this.captions[id].remove();
		}
		this.captions = { }
	},

	add: function(id) {
		var caption = this.get(id)
		if(caption) {	
			return caption
		}

		caption = Caption.create()
		caption.appendToDocument()
		caption.rePlace()

		this.captions[id] = caption
		return caption
	}

})

module.exports = CaptionManager