Q = require \q
fs = require \fs
path = require \path
{file-wrapper:mime} = require \mime-magic
{Walk} = require "../mvc/loader"

munge(a,b) = a <<< b

exports.file = (base,dir,file)-->
	promise = Q.ncall fs.read-file, fs, file
	key = path.join base,path.relative dir,file
	type = mime.future null,file
	(key):->
		body: promise.then ->[it] # wrap in an array
		headers: 'content-type': type.result

exports.dir = (base,dir)->
	Walk dir
	|> map exports.file base, dir
	|> fold munge, {}