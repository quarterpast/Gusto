Gusto
=====

Unfancy MVC


## what works

nothing

## no but really

#### views/foo/show.html
```html
<h1>{{bar}}</h1>
<p>{{baz}}</p>
```

#### controllers/foo.js
```javascript
var Controller = require('gusto').Controller,
    FooModel = require('../models/foo'),
    jsonResponse = require('dram').json,
    bodyParse = require('corps').auto;

module.exports = Controller.extend('Foo', {
  show: Controller.root(function(id) {
    var that = this;
    return Controller.prototype.find.call(this, {id: id}).flatMap(function(data) {
      return that.render(data);
    });
  }),
  
  create: Controller.root(Controller.post(function create() {
    return bodyParse(this.request).flatMap(function(data) {
      return create.super$(data);
    }).flatMap(function() {
      return jsonResponse(data);
    });
  }))
}).meta({model: FooModel});
```

#### models/foo.js
```javascript
var Model = require('gusto').Model;

module.exports = Model.extend('Foo', {}).meta({
  id: Model.primary(Model.autoincrement('integer')),
  bar: Model.size(50, String),
  baz: String
});
```

#### command line
```bash
$ gusto &
$ curl -XPOST -D '{"bar": "lorem ipsum", "baz": "dolor sit amet"}' -H 'Content-type: application' -i localhost:3000/foo
HTTP/1.1 200 OK
content-type: application/json

{"id": 1, "bar": "lorem ipsum", "baz": "dolor sit amet"}

$ curl -i localhost:3000/foo/1
HTTP/1.1 200 OK
content-type: text/html

<h1>lorem ipsum</h1>
<p>dolor sit amet</p>
```

that's about it for now.

it's not finished. don't use it. the version on npm is not the same as this one and won't work the same.
