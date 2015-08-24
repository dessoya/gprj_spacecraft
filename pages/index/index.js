
var Class			= require('class')
  , WS				= require('net/ws')
  , AuthMenu		= require('menu/top/auth')
  , NavigateMenu	= require('menu/side/navigate')
  , cookie			= require('cookie')
  , config			= require('config')
  , hashSections	= require('hashSections')
  , qparams			= require('qparams')

module.exports = function() {

    console.log('qparams')
    console.log(qparams)

	document.querySelector('body').innerHTML = require('layout.html')()
		
	var port = qparams.port ? qparams.port : 9400
	var c = WS.create("ws://192.168.88.101:" + port + "/ws")

	var nm = NavigateMenu.create();
	nm.place('#menu_cont')

	var sections = hashSections.create();

	sections.addSection(require('sections/about').create('#view_cont', c))
	sections.addSection(require('sections/start').create('#view_cont', c, nm))
	sections.addSection(require('sections/profile').create('#view_cont', c))
	sections.addSection(require('sections/metropolis').create('#view_cont', c))	

	// auth
	c.on('auth', function(command, message) {

		cookie(config.auth.cookie, message.session_uuid);
		window.session_uuid = message.session_uuid;

		var am = AuthMenu.create(c, message.is_auth, message.auth_methods, message.user)
		am.place('#usermenu')

		if(message.is_auth) {
			if(message.player_exists) {
				nm.setPlayerMenu()
			}
			else {
				nm.setUserMenu()
			}
			sections.setSection(message.user.section);
		}
		else {
			nm.setGuestMenu()
		}


		sections.start();

	})

	// get from cookie
	c.send({command: "auth", session_uuid: qparams.session_uuid ? qparams.session_uuid : cookie(config.auth.cookie) })

	c.on('reload', function(command, message) {
		document.location = "/"
	})

	// common
	c.connect()



}
