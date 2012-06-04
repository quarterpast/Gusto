exports.signal = function signal def
	$callbacks = []
	$queue = []
	$callbacks[0] = def if def?
	return
		connect: (cb)->
			cb.apply this,$queue.shift! if $queue.length
			$callbacks.push cb
		fire: ->
			for cb of $callbacks
				cb ... 
			else $queue.push arguments