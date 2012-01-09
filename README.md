Struct
======
...is a tiny little MVC framework for Node.js, inspired rather loosely by Play!. It uses [JugglingDB](https://github.com/1602/jugglingdb) for the ORM, a [jQote2](https://github.com/quarterto/jQote2)-based template engine, my very own [hot.js](https://github.com/quarterto/hot.js) for hot module reloading, and finally [Sugar](http://sugarjs.com/) to sweeten up the API.

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
Note: I couldn't be bothered implementing some kind of SQL, so ```mvc.model#fetch``` is modelled after Array#filter (actually, it *is* ```Array#filter```).


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