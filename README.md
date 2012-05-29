Struct
======
...is a tiny little MVC framework for Node.js, inspired rather loosely by Play!. It uses [JugglingDB](https://github.com/1602/jugglingdb) for the ORM, a [jQote2](https://github.com/quarterto/jQote2)-based template engine, my very own [hot.js](https://github.com/quarterto/hot.js) for hot module reloading, and finally [Sugar](http://sugarjs.com/) to sweeten up the API. It's release under the MIT Licence, so hack away.

Let's make a model!

```javascript
const model = require("mvc/model.js"),
      models = require("mvc/list.js").models;

exports.post = model.define({
	title: {type:String},
	date: {type:Date},
	content: {type:String}
});
exports.post.belongsTo(models.user,{as:"author"});
```
And a controller!

```javascript
const models = require("mvc/list.js").models;

module.exports = {
	"view": function(params) {
		var post;
		if("id" in params) {
			post = models.post.find(params.id);
		} else {
			post = models.post.findAll();
		}
		this.render(post);
	}
};
```

How about a view‽

```javascript
{{$.extends("base")}}
<article>
	<h1>{{=title}}</h1>
	<h2>by {{=author.realName}}</h2>
	<time pubdate="pubdate" datetime="{{=date.toJSON()}}">{{=date.relative()}}</time>
	<p>{{=content}}</p>
</article>
```
The object passed to ```mvc.controller#render``` in the action becomes the global object in the template. The variable ```$``` is an object containing utility methods for templates, such as reverse routing and template inclusion. There's also a list of the controllers passed in on ```_```, to facilitate easy reverse routing.

The internals
=============
Events. Events everywhere.

So: main.js sets up the config and takes arguments, then calls server.js, which creates the server, readies the router and hotloader, and waits for a request. On request, the router gets any matching controllers, which are loaded on the fly thanks to the hotloader's getters, then the best match is run by the server. The controller does its business; any call to ```render``` initialises the renderer, loading the templates asynchronously, running jQote and emitting a ```render``` event when it's finished. In ```render```, the event is caught and the rendered content is queued for output to the server, and it emits a ```done``` event. The server listens for ```done```, flushes the headers and runs the queue, which probably includes some calls to response.write.
