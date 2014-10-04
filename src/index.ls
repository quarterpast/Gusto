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
	'data.array'.concat-map
	dram.not-found
	Symbol: \es6-symbol
	deepmerge
	\any-db
	fs
	σ: \highland

	'./app/template'
	'./app/load'
}



values = -> [v for k,v of it]
flat-values = values . flat.flatten
tree-map = (f,t)--> flat.unflatten {[k, (f v,k)] for k, v of flat.flatten t}

stream-handle-error = (fn)->
	(...args)->
		σ [null] .map fn

server = Symbol \server
connection = Symbol \connection

extended = (subclass)->
	@{}subclasses[subclass.display-name] = subclass

Controller import {extended}
Model import {extended}

export Controller
export Model
export class App extends Base implements template, load
	port: 3000
	paths: {\controllers \views \models}

	controller-routes: ->
		route concat-map (.routes!), flat-values @controllers

	404: -> (req)-> not-found req.url

	routes: ->
		@404!

	handler: ->
		handle route [@controller-routes!, @routes!]

	server: ->
		@[server] ?= http.create-server @handler!

	run: ->
		@server!.listen @port

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

