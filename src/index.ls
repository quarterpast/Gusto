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
}

require-tree-no-index = require-tree _, {-index}

values = -> [v for k,v of it]
require-flat-tree = values . flatten . require-tree-no-index

flat-map = (f, xs)--> xs.reduce do
	(ys, x)-> ys ++ f x
	[]

export Controller
export class App extends Base
	port: 3000
	paths: {\controllers \views \models}

	routes: ->
		route flat-map (.routes!), @controllers

	server: ->
		http.create-server handle @routes!

	run: ->
		@server!.listen @port

	resolve-path: (file)->
		path.resolve (path.dirname require.main.filename), file

	template-compiler: handlebars.compile
	template: -> brio @template-compiler, @views

	init-views: ->
		@views = require-tree-no-index @resolve-path @paths.views
	
	init-controllers: ->
		Controller.template = @template!
		@controllers = require-flat-tree @resolve-path @paths.controllers

	->
		@init-views!
		@init-controllers!

