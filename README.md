Gusto
=====

Unfancy MVC


## what works

nothing

## no but really

#### views/foo/bar.html
```html
{{greeting}} world
```

#### controllers/foo.js
```javascript
var Controller = require('gusto').Controller;

module.exports = Controller.extend('Foo', {
  bar: function(greeting) {
    return this.render({greeting: greeting});
  }
});
```

#### command line
```bash
$ gusto &
$ curl localhost:3000/foo/bar/hello
hello world
```

that's about it for now.

it's not finished. don't use it. the version on npm is not the same as this one and won't work the same.
