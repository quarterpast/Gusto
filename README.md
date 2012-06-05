Gusto
=====
...is an MVC framework written in [Coco](http://github.com/satyr/coco) for Node. It's geared towards flexibility without sacrificing simplicity, and at a mere ~500loc it's lightweight too. It's released under the MIT Licence, so hack away.
##Sample
###controllers/site.co
```coffeescript
{Controller,action} = require \gusto/lib/mvc/controller
{get} = require \gusto/lib/server/router

exports.site = Controller {
	index: get "home", action (self)->
		self.render greet:"world!"
}
```
###views/site/index.eco
```html
Hello #{greet}
```
###run.co
```coffeescript
Gusto = require \gusto
app = Gusto.defaults!
app.listen 8001
```

```bash
$ coco run.co &
LOG	5174 Listening on *:8001
$ curl http://localhost/home
Hello world!
```