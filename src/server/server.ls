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

{Router} = require "./router"
{HTTPStatus} = status = require "./status"
{Loader} = require "../mvc/loader"
{Log} = require "../log"
{async,sync-promise} = require "../magic"
{Timer} = require "../timer"

class exports.Server
	@error = {}
	@last-error = false
	@hijack = (id,promise,err)->
		err.previous = @last-error
		err.next = false
		@error[id] = err
		if @last-error then @error[@last-error].next = id
		@last-error = id
		promise.then ~>
			if @error[id].previous
				@error[@error[id].previous].next = @error[id].next
			if @error[id].next
				@error[@error[id].next].previous = @error[id].previous
			if @last-error is id
				@last-error = @error[id].previous
			delete @error[id]

	serve: !(request)-> 
		out = Q.defer!
		Sync ->
			time = new Timer "#{request.connection.remote-address} #{request.path}"
			if ..last-error and ..error[..last-error] then
				return out.resolve {
					headers: "content-type":"text/html"
					status: 200
					onclose: time.~end
				} <<< ..error[..last-error]
			try
				time.start \qs-parse
				get = url.parse request.url,true .query
				post = if request.method is \POST and request.headers."content-length" then
					querystring.parse sync-promise request.body.read!
				else {}
				request <<< {get,post}
				time.finish \qs-parse
				
				time.start \routing
				o = Router.route request
				time.finish \routing
				o
			catch
				time.start \error
				Log.error e.message
				console.warn e.stack
				
				o = if e instanceof HTTPStatus then e else status.500 wrap:e
				time.finish \error
				o
			|> (.to-response request,time) |> out.resolve

		return out.promise
	->
		@server = http.Server @~serve
	listen: (port,host)->
		Log.log "listening on %s:#port",(host or "*")
		@server.listen port,host