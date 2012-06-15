Q = require \q
fs = require \fs
path = require \path
{fileWrapper:mime} = require \mime-magic
{Walk} = require "../mvc/loader"

exports.file = (base,file,dir)->
	promise = Q.ncall fs.readFile, fs, file
	key = path.join base,path.relative dir,file
	type = mime.future null,file

	(key): ->
		body: promise.then ->[it] # wrap in an array
		headers: 'content-type': type.result

exports.dir = (base,dir)->
	out = {}
	for file in Walk dir
		out <<< exports.file base, file, dir
	return out