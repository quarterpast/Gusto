require! {
	BaseController: sodor.Controller
	awdry
	estira.extend
	muck
}

module.exports = class Controller extends BaseController implements muck.mixin
	import awdry
	import {extend}

	@template = ->
		@app.template! ...

	model: @private ->
		if @@model?
			that.schema

	connection: @private ->
		@@app.db-connection!
