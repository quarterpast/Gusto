(function(){
  var codes, HTTPStatus;
  codes = {
    100: 'Continue',
    101: "Switching Protocols",
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: "Non-authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: 'Found',
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    400: "Bad Request",
    401: 'Unauthorized',
    403: 'Forbidden',
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: 'Conflict',
    410: 'Gone',
    411: "Length Required",
    412: "Precondition Failed",
    413: "Request Entity Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Request Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    420: "Enhance Your Calm",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates"
  };
  exports.HTTPStatus = HTTPStatus = (function(superclass){
    HTTPStatus.displayName = 'HTTPStatus';
    var prototype = __extend(HTTPStatus, superclass).prototype, constructor = HTTPStatus;
    function HTTPStatus(){
      superclass.apply(this, arguments);
    }
    return HTTPStatus;
  }(Error));
  zipWith(function(code, explanation){
    return exports[code] = (function(superclass){
      var prototype = __extend(constructor, superclass).prototype;
      prototype.explanation = explanation;
      prototype.code = code;
      prototype.toString = __curry(function(){
        return "Error " + code + ": " + explanation;
      });
      function constructor(info){
        var __this = this instanceof __ctor ? this : new __ctor;
        __this.info = info;
        superclass.apply(__this, arguments);
        return __this;
      } function __ctor(){} __ctor.prototype = prototype;
      prototype.body = __curry(function(err){
        var that;
        err == null && (err = this);
        return filter(id, ["<h1>" + err + "</h1>", (that = err.message) != null ? "<h2>" + that + "</h2>" : void 8, (that = this.info.path) != null ? "<h3>" + that + "</h3>" : void 8, (that = err.stack) != null ? "<pre>" + unlines(tail(lines(that))) + "</pre>" : void 8]);
      });
      prototype.toResponse = __curry(function(headers){
        var that, __ref;
        headers == null && (headers = {});
        return {
          headers: (__ref = __clone(headers), __ref["content-type"] = "text/html", __ref),
          status: code,
          body: this.body((that = this.info.wrap) != null ? that : void 8)
        };
      });
      return constructor;
    }(HTTPStatus));
  }, keys(codes), values(codes));
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __curry(f, args){
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length && arguments.length ?
        __curry.call(this, f, params) : f.apply(this, params);
    } : f;
  }
  function __clone(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);
