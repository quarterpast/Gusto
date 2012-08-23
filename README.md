[![build status](https://secure.travis-ci.org/quarterto/Gusto.png)](http://travis-ci.org/quarterto/Gusto)
Gusto
=====
...is an MVC framework written in [LiveScript](http://github.com/gkz/LiveScript) for Node. It's geared towards flexibility without sacrificing simplicity, and at a mere ~500loc it's lightweight too. It's released under the MIT Licence, so hack away.
##Installation
```bash
npm install gusto
```
##Sample
###controllers/site.ls
```coffeescript
{Controller,action} = require \gusto/lib/mvc/controller
{get} = require \gusto/lib/server/router

exports.site = Controller {
	index: get "home", action (self)->
		self.render greet:"world!"
}
```
###views/site/index.els
```html
Hello #{greet}
```
###run.ls
```coffeescript
Gusto = require \gusto
app = Gusto.defaults!
app.listen 8001
```

```bash
$ livescript run.ls &
LOG	5174 Listening on *:8001
$ curl http://localhost/home
Hello world!
```