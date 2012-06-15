# router.co
{Config} = require "../main"
{signal} = require "../mvc/signal"
url = require \url

methods = <[ * HEAD GET POST PUT TRACE DELETE OPTIONS PATCH ]>

class exports.NotFound extends Error
	-> super "Could not route #it"

class exports.Route
	(@method,@path,@action)->
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
	add: (method or '*',path,action)-->
		@routeHash["#method #path"] = if method instanceof Route 
			method
		else new Route method,path,action

	methods.forEach (method)->
		::[method.toLowerCase!] = ::add method
	::any = ::'*'

	use: (obj,re=true)->
		if re and obj.reload?
			obj.reload.connect (keys)~> @use obj,false

		for own path, func of obj
			if func.aliases?
				for p,method of func.aliases
					@add method, p, func
			@add func.method, path, func

exports.alias = (obj,func)->
	func@aliases <<< obj
	return func

methods.forEach (method)->
	exports[method.toLowerCase!] = (id,func)->
		if typeof id is \string
			exports.alias (id):method, func
		else
			func <<< {method}

exports.any = exports.'*'