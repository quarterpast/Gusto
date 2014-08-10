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
}

require-tree-no-index = require-tree _, {-index}

values = -> [v for k,v of it]
require-flat-tree = values . flatten . require-tree-no-index

export Controller
export class App extends Base
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
	template: -> brio @template-compiler, @views
	template-extensions: [\.html]

	init-views: ->
		@views = require-tree-no-index @resolve-path @paths.views
	
	init-controllers: ->
		Controller.template = @template!
		@controllers = require-flat-tree @resolve-path @paths.controllers

	(options)->
		import options
		@template-extensions.for-each aught
		@init-views!
		@init-controllers!

