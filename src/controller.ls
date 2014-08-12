require! {
	BaseController: sodor.Controller
	awdry
	estira.extend
}

module.exports = class Controller extends BaseController
	import awdry
	import {extend}

	@extended = (subclass)->
		@{}subclasses[subclass.display-name] = subclass

	@template = ->
		@app.template! ...
