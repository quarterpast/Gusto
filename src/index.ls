require! {
	Base: estira
	Controller: './controller'
	Model: './model'
	flat
	deepmerge
	\any-db

	'./app/template'
	'./app/load'
	'./app/server'
	'./app/symbols'.connection
}

tree-map = (f,t)--> flat.unflatten {[k, (f v,k)] for k, v of flat.flatten t}

extended = (subclass)->
	@{}subclasses[subclass.display-name] = subclass

Controller import {extended}
Model import {extended}

export Controller
export Model
export class App extends Base implements template, load, server
	paths: {\controllers \views \models}

	db-url: -> "sqlite3://#{display-name.to-lower-case!}.db"
	db-connection: ->
		@[connection] ?= any-db.create-connection @db-url!

	controllers-preload: ->
		@merge-property \controllers tree-map @~configure, Controller{}subclasses

	models-preload: ->
		@merge-property \models tree-map @~configure, Model{}subclasses

	merge-property: (prop, obj)->
		@[prop] = @{}[prop] `deepmerge` obj

	(options = {})->
		import this `deepmerge` options

		@load \views
		@load \controllers
		@load \models

