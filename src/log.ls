util = require \util

class Logger
	@colours =
		red: "\x1b[31m"
		reset: "\x1b[0m"
	@levels = []
	@setLevel = (level)->
		for lvl,i in @levels
			for log in lvl
				log.silent = i<level

	silent: false
	(@level,@id,@stream=process.stdout)~>
		if ..levels[level]?
			..levels[level].push this
		else
			..levels[level] = [this]
	print: ->
		unless @silent
			@stream.write "#{@id}\t#{process.pid}\t#{util.format ...}\n"

exports.Log =
	debug: Logger 0,\DEBUG .~print
	log: Logger 1,\LOG .~print
	warn: Logger 2,\WARN,process.stderr .~print
	error: Logger 3,"#{Logger.colours.red}ERROR#{Logger.colours.reset}",process.stderr .~print