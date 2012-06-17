util = require \util
dirs = require \path
{Walk,Reloader,Paths} = require "./loader"
{signal} = require "./signal"
{async,handle} = require "../magic"
{Server} = require "../server/server"
{Log} = require "../log"
Sync = require \sync

class ControllerSupport
	@views = []
	(@action)->
	call: (action,args)->
		...
	render-JSON: ->
		status: 200
		\content-type : "application/json"
		body: [JSON.stringify it]
	render: (path, args = {})->
		if typeof path is not "string"
			[args,path] = [path or args,@id]
		for system in ..views
			view = system.resolve path
			return view.run args if view
		...

exports.ControllerLoader = (dir)->
	out = new class
		reload: signal!
	Walk dir |> each (file)->
		Reloader file, handle (exp)->
			keys = for id,action of Paths exp
				out[id] = action
				action.support.id = id
			out.reload.fire keys
	return out

exports.Controller = (actions)->
	for r,action of actions
		props = {support: new ControllerSupport actions[r]} <<< action
		actions[r] = action.bind props.support
		actions[r] <<< props
	return actions

exports.Controller.views = (sys)->
	ControllerSupport.views.push sys

exports.action = (spec,func)->
	[func,spec] = if spec instanceof Function then [spec,{}] else [func,spec]

	out = (...args)->
		args .= 0 if @@length is 1 and typeof @@0 is \object
		return func.call {[param,if args[param]? then that else args.shift!] for param,type of spec},this
	out.expects = spec
	return out