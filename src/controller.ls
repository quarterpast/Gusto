require! {
	BaseController: sodor.Controller
	awdry
	estira.extend
	muck
	sql
	Symbol: \es6-symbol
	brio.errors
}

schema = Symbol \schema

private-mixin = {[k, BaseController.private v] for k,v of muck.mixin}

module.exports = class Controller extends BaseController implements private-mixin
	import awdry
	import {extend}

	@template = (path, data)->
		try
			@app.template! ...
		catch
			if e instanceof errors.PathNotFoundError
				JSON.stringify data
			else throw e


	model: @private ->
		@[schema] ?= if @@@model?
			sql.define that.schema!

	connection: @private ->
		@@@app.db-connection!
	
	->
		if @@@model?
			then @init!

		super ...
