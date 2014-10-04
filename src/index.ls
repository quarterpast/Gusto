require! {
	Base: estira
	Controller: './controller'
	Model: './model'
	livewire.route
	handle: oban
	http
	\require-tree
	flat
	path
	dram.not-found
	deepmerge
	\any-db
	fs
	σ: \highland

	'./app/template'
	'./app/load'
	'./app/server'
}



tree-map = (f,t)--> flat.unflatten {[k, (f v,k)] for k, v of flat.flatten t}

stream-handle-error = (fn)->
	(...args)->
		σ [null] .map fn


extended = (subclass)->
	@{}subclasses[subclass.display-name] = subclass

Controller import {extended}
Model import {extended}

export Controller
export Model
export class App extends Base implements template, load, server
	paths: {\controllers \views \models}
	

	resolve-path: (file)->
		path.resolve @base-path!, file

	base-path: -> path.dirname require.main.filename


	db-url: -> "sqlite3://#{display-name.to-lower-case!}.db"
	db-connection: ->
		@[connection] ?= any-db.create-connection @db-url!

	controllers-preload: ->
		@merge-property \controllers tree-map @~configure, Controller{}subclasses

	models-preload: ->
		@merge-property \models tree-map @~configure, Model{}subclasses

	merge-property: (prop, obj)->
		@[prop] = @{}[prop] `deepmerge` obj

	load: (thing)->
		@"#{thing}Preload"?!
		exists <- fs.exists @paths[thing]
		if exists
			@merge-property thing, @load-tree @resolve-path @paths[thing]

	(options = {})->
		import this `deepmerge` options

		@load \views
		@load \controllers
		@load \models

