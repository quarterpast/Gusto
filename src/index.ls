require! {
	Base: estira
	'./controller.ls'
	livewire.route
	handle: oban
	http
	require-tree
	flat
	path
	handlebars
	brio
}

require-flat-tree = Object.values . flat . require-tree

flat-map = (f, xs)--> xs.reduce do
	(ys, x)-> ys ++ f x
	[]

class App extends Base
	port: 3000
	paths: {\controllers \views \models}

	routes: ->
		flat-map (.routes!), @controllers

	run: ->
		http.create-server handler @routes!
			.listen @port

	resolve-path: (file)->
		path.resolve (path.dirname require.main.filename), file

	templater: handlebars

	->
		@views = require-tree @resolve-path @paths.views
		Controller.set-templates brio @templater, @views
		@controllers = require-flat-tree @resolve-path @paths.controllers

