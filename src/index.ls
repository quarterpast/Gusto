require! {
	Base: estira
	Controller: './controller'
	livewire.route
	handle: oban
	http
	\require-tree
	flat.flatten
	path
	handlebars
	brio
	'data.array'.concat-map
	aught
	dram.ok
}

require-tree-configure = (app, path)-->
	require-tree path, index: no each: (import {app})

values = -> [v for k,v of it]

export Controller
export class App extends Base
	require-tree: -> require-tree-configure this, it
	require-flat-tree: -> values flatten @require-tree it

	port: 3000
	paths: {\controllers \views \models}

	routes: ->
		route concat-map (.routes!), @controllers

	server: ->
		http.create-server handle @routes!

	run: ->
		@server!.listen @port

	resolve-path: (file)->
		path.resolve @base-path!, file

	base-path: -> path.dirname require.main.filename

	template-compiler: handlebars.compile
	template: ->
		(path, data)~> ok brio @template-compiler, @views, path, data
	template-extensions: [\.html]

	init-views: ->
		@template-extensions.for-each aught
		@views = @require-tree @resolve-path @paths.views
	
	init-controllers: ->
		Controller.template = @template!
		@controllers = @require-flat-tree @resolve-path @paths.controllers

	(options)->
		import options
		
		@init-views!
		@init-controllers!

