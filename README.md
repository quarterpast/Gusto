Struct
======
...is a tiny little MVC framework, inspired rather loosely by Play!, aimed at Rhino 1.7R3. It uses the mostly-undocumented, probably-a-bad-choice com.sun.net.httpserver to cut down on dependencies.

Let's make a model!

```javascript
const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id)
exports.post = mvc.model({
	title: {type:String},
	date: {type:Date,format:"dd/mm/yyyy"},
	content: {type:String,flags:["main"]}
});
```
And a controller!

```javascript
const mvc = require("mvc.js").init(module.id),
      models = mvc.models(module.id)
exports.posts = mvc.controller({
	"view": function(params) {
		
	}
});
```

How about a view‽

```javascript
exports.template

```

A few caveats: Rhino's current E4X parsing is... pretty bad. For example, empty tags are collapsed to XML short tags. So if you have ```<script src="path/to/file.js"></script>``` it gets collapsed to ```<script src="path/to/file.js"/>``` which all current browsers take as meaning that the entire rest of the page is the script body. Embedding scripts is sometimes janky too.