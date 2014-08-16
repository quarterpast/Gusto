require! {
	BaseController: sodor.Controller
	awdry
	estira.extend
	muck
	sql
	Symbol: \es6-symbol
}

schema = Symbol \schema

module.exports = class Controller extends BaseController implements muck.mixin
	import awdry
	import {extend}

	@template = ->
		@app.template! ...

	model: @private ->
		@[schema] ?= if @@@model?
			sql.define that.schema!


	connection: @private ->
		@@@app.db-connection!
