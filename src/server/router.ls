# router.co
{Config} = require "../main"
status = require "./status"
url = require \url

methods = <[ head get post put trace delete options patch ]>

every-method = map _,methods

class Aliases
	every-method (m)->::[m] = []
	add: (obj)->
		|typeof obj is \string => every-method (m)~>
			@[m].unshift obj
		|otherwise=> for m,url of obj=> @[m].unshift url
	set-method: (skip)-->
		every-method (m)~> when m is not skip => @[m] = []
c=0
class exports.Route
	(@method = '*',@path,@action)->
		@method .=to-upper-case!
		action.to-string = action.route = @~reverse
	equals: (other)->
		return and-list zip-with (==), @[\method,\path], other[\method,\path]
	to-string: -> "#{@method.to-upper-case!} #{@path}"
	match: (request)->
		return false unless @method in ['*',request.method]
		return and-list zip-with (reqpart,part)->
			switch
			| head part is ":" => true
			| otherwise => reqpart is part
		,(tail request.path .split '/'),(@path.split '/')
	to-response: (request,time)->
		time.start \param-snarf
		params = {}
		@path.split "/"
		|> zip-with (reqpart,part)->
			| head part is ":" => params[tail part] = reqpart
		, (tail request.path .split '/')
		time.finish \param-snarf
		time.start \param-munge
		if @action.expects?
			for own param,type of @action.expects
				val = request.post[param]
				or    request.get[param]
				or    params[param]
				or    reqparts.shift!
				params[param] = new type val
		else params <<< request.get <<< request.post
		time.finish \param-munge

		time.start \action-run
		body = @action params with {time}
		time.finish \action-run
		time.start \promise-wait
		{
			headers: "content-type":"text/html"
			status: 200
			onclose: time.~end
		} with if \forEach of body then {body} else body
	reverse: (params)->
		...


exports.alias = (obj,func)->
	(func.aliases ?= new Aliases).add obj
	return func

every-method (method)->
	exports[method] = (id,func)->
		| typeof id is \string => return exports.alias (method):id,func
		| otherwise => (id.aliases ?= new Aliases).set-method method
		return id

class exports.Router
	@routers = []
	@route = (req)->
		that = concat-map (.route req), @routers
		switch
			| empty that => status.404 {req.path}
			| _ => head that
	routes: []
	-> ..routers.push @
	route: (req)->
		filter (.match req), @routes
	register: (method,path,action)-->
		| method.to-lower-case! in '*' & methods =>
			route = new Route method,path,action
			if find (.equals route), @routes
				that{action} = route
			else @routes.push route
		| otherwise => throw new Error "invalid method #method"
	add: (path,action)->
		if action.aliases?
			zip-with (method,paths)~>
				each (~> @register method,it,action),paths
			,methods,every-method action.aliases
			
		@~register '*',path,action

	every-method (method)->::[method] = ::register method

	use: (obj,re=true)->
		if re and obj.reload?
			obj.reload.connect ~> @use obj,false

		for own path, func of obj
			@add path, func

