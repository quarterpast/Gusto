gusto = require '../../lib'
{ok} = require \dram
{expect} = require \karma-sinon-expect

class Foo extends gusto.Controller
	bar: -> ok 'hello'
app = new gusto.App

request = (app, url, method = \GET)-> app.controller-routes! {url, method}

export 'Controller':
	'should respond to requests': (done)->
		(app `request` '/foo/bar').to-array (xs)->
			expect xs[xs.length - 1] .to.be 'hello'
			done!
