# router.co
{Config} = require "../main"
{signal} = require "../mvc/signal"
url = require \url
{flip} = require \prelude-ls

methods = <[ HEAD GET POST PUT TRACE DELETE OPTIONS PATCH ]>

class exports.NotFound extends Error
	-> super "Could not route #it"

class Aliases
	for m in methods => ::[m] = []
	add: (obj)->
		|typeof obj is \string => for m in methods=> @[m].unshift obj
		|otherwise=> for m,url of obj=> @[m].unshift url
	set-method: (skip)-->
		for m in methods when m is not skip => @[m] = []

class exports.Route
	(@action,@path,@method = '*')->
		action.toString = action.route = @~reverse
	match: (request)->
		return false unless @method in ['*',request.method]
		reqparts = request.path.substr 1 .split '/'
		searchparts = @path.split '/'

		params = {}
		for part,i in searchparts
			reqpart = reqparts.shift!
			if part.0 is '#'
				params[part.substr 1] = reqpart
			else
				if reqpart is not part then return false
		if @action.expects?
			for own param,type of @action.expects
				val = request.post[param]
				or    request.get[param]
				or    params[param]
				or    reqparts.shift!
				params[param] = new type val
		else params <<< request.get <<< request.post
		return params

	reverse: (params)->
		...
exports.alias = (obj,func)->
	(func.aliases ?= new Aliases).add obj
	return func

methods.forEach (method)->
	exports[method.toLowerCase!] = (id,func)->
		|typeof id is \string => return exports.alias (method):id, func
		| otherwise => (id.aliases ?= new Aliases).set-method method
		return id

class exports.Router
	@routers = []
	@route = (req)->
		for router in @routers
			for route in router.routes
				if params = route.match req =>{route.action,params}
				else new NotFound req.url
	routeHash: {}
	routes:~ -> [v for k,v of @routeHash]
	-> ..routers.push @
	add: (path,action)-->
		console.log path,action

	methods.forEach (method)->
		::[method.toLowerCase!] = flip ::add << exports[method]
	::any = ::add null

	use: (obj,re=true)->
		if re and obj.reload?
			obj.reload.connect (keys)~> @use obj,false

		for own path, func of obj
			if func.aliases?
				for p,method of func.aliases
					@add method, p, func
			@add func.method, path, func

