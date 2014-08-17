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
	handlebars
	brio
	'data.array'.concat-map
	aught
	dram.ok
	dram.not-found
	Symbol: \es6-symbol
	deepmerge
	\any-db
}

require-tree-configure = (each, path)-->
	require-tree path, {-index, each}

values = -> [v for k,v of it]
flat-values = values . flat.flatten
tree-map = (f,t)--> flat.unflatten {[k, (f v,k)] for k, v of flat.flatten t}

server = Symbol \server
connection = Symbol \connection

extended = (subclass)->
	@{}subclasses[subclass.display-name] = subclass

Controller import {extended}
Model import {extended}

export Controller
export Model
export class App extends Base
	load-tree: ->
		require-tree-configure @~configure, it

	configure: (import app:this)

	port: 3000
	paths: {\controllers \views \models}

	controller-routes: ->
		route concat-map (.routes!), flat-values @controllers

	404: -> (req)-> not-found req.url

	routes: ->
		@404!
		
	server: ->
		@[server] ?= http.create-server handle route [@controller-routes!, @routes!]

	run: ->
		@server!.listen @port

	resolve-path: (file)->
		path.resolve @base-path!, file

	base-path: -> path.dirname require.main.filename

	template-compiler: handlebars.compile
	template-extensions: [\.html]
	template: -> (path, data)~>
		ok brio do
			@template-compiler
			@views
			path
			data
	
	db-url: -> "sqlite3://#{display-name.to-lower-case!}.db"
	db-connection: ->
		@[connection] ?= any-db.create-connection @db-url!

	views-preload: ->
		@template-extensions.for-each aught

	controllers-preload: ->
		@merge-property \controllers tree-map @~configure, Controller{}subclasses

	models-preload: ->
		@merge-property \models tree-map @~configure, Model{}subclasses

	merge-property: (prop, obj)->
		@[prop] = @{}[prop] `deepmerge` obj

	load: (thing)->
		@"#{thing}Preload"?!
		@merge-property thing, @load-tree @resolve-path @paths[thing]

	(options)->
		import this `deepmerge` options

		@load \views
		@load \controllers
		@load \models

