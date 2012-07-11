{Log} = require "./log"
class exports.Timer
	sections: {}
	(@label)-> @start \total
	end():
		@sections |> filter (instanceof Date) |> keys |> each @~finish
		Log.log @label+": "+@sections.total+"ms"
		Log.debug JSON.stringify @sections
	start(section):
		@sections[section] = new Date
	finish(section):
		@sections[section] = new Date - @sections[section]