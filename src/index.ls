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
flat-values = values . flatten

export Controller
export class App extends Base
	require-tree: -> require-tree-configure this, it

	port: 3000
	paths: {\controllers \views \models}

	routes: ->
		route concat-map (.routes!), flat-values @controllers

	server: ->
		http.create-server handle @routes!

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

	views-preload: ->
		@template-extensions.for-each aught

	load: (thing)->
		@"#{thing}Preload"?!
		@[thing] = @require-tree @resolve-path @paths[thing]

	(options)->
		import options

		@load \views
		@load \controllers

