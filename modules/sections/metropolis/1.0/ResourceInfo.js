
var Control		= require('ui/control')

var ResourceInfo = Control.inherit({

	controlName: 'resource-info',

    onInit: function() {        
    	Object.observe(this, this.onPropChange.bind(this))
    },

	render: function() {
		return require('ResourceInfo.html')({ })
	},

	afterPlace: function() {
	    var ph = this.getPlaceHolderElement()

		this.el_population = ph.querySelector('#population')
		this.el_population_avail = ph.querySelector('#population_avail')
		this.el_minerals = ph.querySelector('.minerals')
		this.el_crystals = ph.querySelector('.crystals')
	},

	onPropChange: function(events) {
		// console.log(events)
		for(var i = 0, l = events.length; i < l; i++) {
			var e = events[i]
			switch(e.name) {
			case "population":
			case "population_avail":
			case "minerals":
			case "crystals":
				if(this.placeHolderElement === null) {
					continue
				}
				switch(e.type) {
				case "add":
				case "update":
					this["el_" + e.name].innerHTML = this[e.name]
				}
			}
		}
	},

	reset: function() {
		this.population_avail = this.population = this.minerals = this.crystals = -1	    
	}
})

module.exports = ResourceInfo