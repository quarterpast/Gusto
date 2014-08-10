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
		flat-map (.routes!), @controllers

	run: ->
		http.create-server handle route @routes!
			.listen @port

	resolve-path: (file)->
		path.resolve (path.dirname require.main.filename), file

	templater: handlebars.compile

	->
		@views = require-tree-no-index @resolve-path @paths.views
		Controller.template = brio @templater, @views
		@controllers = require-flat-tree @resolve-path @paths.controllers

