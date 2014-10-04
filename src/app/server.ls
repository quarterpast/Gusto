require! {
	'./symbols'.server
	handle: oban
	livewire.route
	flat
	'data.array'.concat-map
}

values = -> [v for k,v of it]
flat-values = values . flat.flatten

export port = 3000

export controller-routes = ->
	route concat-map (.routes!), flat-values @controllers

export 404: -> (req)-> not-found req.url

export routes = ->
	@404!

export handler = ->
	handle route [@controller-routes!, @routes!]

export server = ->
	@[server] ?= http.create-server @handler!

export run = ->
	@server!.listen @port
