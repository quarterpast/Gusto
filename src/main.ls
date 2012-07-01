Sync = require \sync
path = require \path
vm = require \vm
LiveScript = require \LiveScript

global <<< require \prelude-ls

exports.defaults = (app-dir = process.cwd!)->
	{Router} = require "./server/router"
	{Controller,ControllerLoader} = require "./mvc/controller"
	{View,ViewLoader} = require "./mvc/view"
	{Server} = require "./server/server"
	{Log} = require "./log"
	Static = require "./server/static"

	server = new Server

	Sync ->
		View.add "els",(file)->vm.create-script LiveScript.compile '["""'+file+'"""]',{+bare}
		View.add "ejs",(file)->vm.create-script file

		Controller.views ViewLoader path.join app-dir,"views"

		with new Router
			@use ControllerLoader path.join app-dir,"controllers"
			@use Static.dir "static", path.join app-dir,"static"

	, (e)->
		if e
			Log.error e.message
			console.log e.stack
			process.exit (e.code or 1)
	return server