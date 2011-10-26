Struct
======
...is a tiny little MVC framework, inspired rather loosely by Play!, aimed at Rhino 1.7R3. It uses the mostly-undocumented, probably-a-bad-choice com.sun.net.httpserver to cut down on dependencies.

Let's make a model!

```javascript
const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id);

exports.post = mvc.model({
	title: {type:String},
	date: {type:Date},
	content: {type:String,flags:["main"]}
});
```
And a controller!

```javascript
const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id);

exports.posts = mvc.controller({
	"view": function(params) {
		var post;
		if("id" in params) {
			post = models.post.fetch(function(post) post.id === params.id)[0];
		} else {
			post = models.post.fetch(function() true)[0];
		}
		this.render(post);
	}
});
```
Note: I couldn't be bothered implementing some kind of SQL, so ```mvc.model#fetch``` is modelled after Array#filter (actually, it *is* ```Array#filter```).


How about a view‽

```javascript
{{$.extends("base")}}
<article>
	<h1>{{=this.title}}</h1>
	<time pubdate="pubdate" datetime="{{=this.date.toJSON()}}">{{=this.date.format("dd/mm/yyyy")}}</time>
	<p>{{=this.content}}</p>
</article>
```
The object passed to ```mvc.controller#render``` in the action becomes ```this``` in the template. The parameter ```$``` is an object containing utility methods for templates, such as reverse routing and template inclusion. It doesn't have to be called ```$```; you could call it ```utility``` or ```antidisestablishmentarianism``` if you really wanted.

A few caveats: Rhino's current E4X parsing is... pretty bad. For example, empty tags are collapsed to XML short tags. So if you have ```<script src="path/to/file.js"></script>``` it gets collapsed to ```<script src="path/to/file.js"/>``` which all current browsers take as meaning that the entire rest of the page is the script body. Embedding scripts is sometimes janky too.