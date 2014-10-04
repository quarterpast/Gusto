require! [brio, dram.ok, handlebars, aught]

export template-extensions = [\.html]

export template = -> (path, data)~>
	ok brio do
		@template-compiler
		@views
		path
		data

export template-compiler = handlebars.compile

export views-preload = ->
		@template-extensions.for-each aught
