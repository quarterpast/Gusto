fs = require \fs
path = require \path
Q = require \q
Sync = require \sync
{async,handle} = require "../magic"
{Server} = require "../server/server"
{Log} = require "../log"

exports.Paths = (obj)->
	acc = {}
	function inner o,dir = ''
		for own k,v of o
			p = path.join dir,k
			if v instanceof Function
				acc[p] = v
			else
				inner v,p,acc
	inner obj
	return acc

class exports.Reloader
	function watch file,cb
		cb "init",file
		try
			fs.watch file,cb
		catch
			Log.debug "Can't use fs.watch for some reason.\n\tFalling back on fs.watchFile for #{path.basename file}"
			curr,prev <- fs.watchFile file
			if curr.mtime is not prev.mtime
				cb "change",file
	(@file,cb)~>
		watch file, async (ev,name=file)~>
			name = with path
				@join @dirname(file), @basename(name)
			cb @load.sync this, name
	load: async handle (name = @file)->
		delete require.cache[path.resolve __dirname,name]
		require name

exports.Walk = walk = (file,acc = [])->
	stat = fs.stat.sync fs, file
	if stat.isDirectory!
		files = fs.readdir.sync fs, file
		for f in files
			acc.concat walk (path.join file,f), acc
	else
		acc.push file
	return acc

