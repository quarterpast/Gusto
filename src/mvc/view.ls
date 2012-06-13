{Walk,Reloader} = require "./loader"
{async,handle} = require "../magic"
{Server} = require "../server/server"
{Log} = require "../log"
dirs = require \path
fs = require \fs

class ViewReloader extends Reloader
	~> super ...
	load: async handle (name = @file)->
		fs.readFile.sync fs, name

class exports.View
	helpers: ->
		include: (path,extra={})~>
			sub = @system.resolve path
			sub.run @args <<< extra
		extend: (path)~>
			@parent = @system.resolve path
			return ""

	@renderers = {}
	@use = (extra)->@renderers <<< extra
	@add = (ext,rend)->@renderers[ext] = rend
	(@compiled,@system)->
	parent: false
	run: (@args)->
		output = @compiled.runInNewContext args <<< @helpers!
		output = @parent.run layout:output if @parent
		return output

class ViewSystem
	views: {}
	(views)-> @use views if views?
	add: (p,view)->
		@views[p] = new View view,this
	use: (views)->
		[@add p,view for p,view of views]
	resolve: (path)->
		for vpath,view of @views
			base = with dirs
				@join (@dirname vpath),@basename vpath,@extname vpath
			if base is path
				return view
		return false

exports.ViewLoader = (dir)~>
	out = new ViewSystem
	Walk dir .forEach (file)->
		ViewReloader file, handle (view)->
			ext = dirs.extname file .substr 1
			if View.renderers[ext]? then rend = new that view else return
			out.add (dirs.relative dir,file), rend
	return  out