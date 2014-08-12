require! {
	Base: estira
	Controller: './controller'
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
	Symbol: \es6-symbol
	deepmerge
}

require-tree-configure = (each, path)-->
	require-tree path, {-index, each}

values = -> [v for k,v of it]
flat-values = values . flat.flatten
tree-map = (f,t)--> flat.unflatten {[k, (f v,k)] for k, v of flat.flatten t}

server = Symbol \server

export Controller
export class App extends Base
	load-tree: ->
		require-tree-configure @~configure, it

	configure: (import app:this)

	port: 3000
	paths: {\controllers \views \models}

	routes: ->
		route concat-map (.routes!), flat-values @controllers

	server: ->
		@[server] ?= http.create-server handle @routes!

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

	controllers-preload: ->
		@merge-property \controllers tree-map @~configure, Controller{}subclasses

	merge-property: (prop, obj)->
		@[prop] = @{}[prop] `deepmerge` obj

	load: (thing)->
		@"#{thing}Preload"?!
		@merge-property thing, @load-tree @resolve-path @paths[thing]

	(options)->
		import this `deepmerge` options

		@load \views
		@load \controllers

