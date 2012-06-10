# server.co
# it's a server
Q = require \q
http = require \q-http
url = require \url
querystring = require \querystring
vm = require \vm
fs = require \fs
util = require \util
Sync = require \sync

{Router,NotFound} = require "./router"
{Loader} = require "../mvc/loader"
{Log} = require "../log"
{async,SyncPromise} = require "../magic"

class Timer
	(req)->
		@id="#{req.connection.remoteAddress} #{req.path}"
		@start = new Date
	end: ->
		@finish = new Date
		Log.log @id+": "+(@finish-@start)+"ms"

class exports.Server
	@error = {}
	@lasterr = false
	@hijack = (id,promise,err)->
		err.previous = @lasterr
		err.next = false
		@error[id] = err
		if @lasterr then @error[@lasterr].next = id
		@lasterr = id
		promise.then ~>
			if @error[id].previous
				@error[@error[id].previous].next = @error[id].next
			if @error[id].next
				@error[@error[id].next].previous = @error[id].previous
			if @lasterr is id
				@lasterr = @error[id].previous
			delete @error[id]

	serve: !(request)-> 
		out = Q.defer!
		Sync ->
			time = new Timer request
			if ..lasterr and ..error[..lasterr] then
				return out.resolve {
					headers: "content-type":"text/html"
					status: 200
					onclose: time.~end
				} <<< ..error[..lasterr]
			res = {}
			try
				get = url.parse request.url,true .query
				post = if request.method is \POST and request.headers."content-length" then
					querystring.parse SyncPromise request.body.read!
				else {}
				request <<< {get,post}
				
				routes = [route] = Router.route request .filter ->
					it not instanceof NotFound
				if routes.length
					{action,params} = route
					res = action params
				else
					out.resolve status: 404,onclose: time.~end,body:["404 #{request.path}"]
			catch
				Log.error e.message
				console.log e.stack
				res = body: [e.message] status: 500
			finally
				out.resolve {
					headers: "content-type":"text/html"
					status: 200
					onclose: time.~end
				} <<< if \forEach of res then
					body: res
				else res
		return out.promise
	->
		@server = http.Server @~serve
	listen: (port,host)->
		Log.log "listening on %s:#port",(host or "*")
		@server.listen port,host