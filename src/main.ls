Sync = require \sync
path = require \path
vm = require \vm
LiveScript = require \LiveScript

appDir = process.cwd!

exports.defaults = ->
	{Router} = require "./server/router"
	{Controller,ControllerLoader} = require "./mvc/controller"
	{View,ViewLoader} = require "./mvc/view"
	{Server} = require "./server/server"
	{Log} = require "./log"
	Static = require "./server/static"

	server = new Server

	Sync ->
		View.add "els",(file)->vm.createScript LiveScript.compile '["""'+file+'"""]',{+bare}
		View.add "ejs",(file)->vm.createScript file

		Controller.views ViewLoader path.join appDir,"views"

		with new Router
			@use ControllerLoader path.join appDir,"controllers"
			@use Static.dir "static", path.join appDir,"static"

	, (e)->
		if e
			Log.error e.message
			console.log e.stack
			process.exit (e.code or 1)


	return server