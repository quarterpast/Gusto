(function(){
  var codes, HTTPError, code, message;
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
  HTTPError = (function(superclass){
    HTTPError.displayName = 'HTTPError';
    var prototype = __extend(HTTPError, superclass).prototype, constructor = HTTPError;
    function HTTPError(){
      superclass.apply(this, arguments);
    }
    return HTTPError;
  }(Error));
  for (code in codes) {
    message = codes[code];
    exports[code] = (__fn(HTTPError));
  }
  function __extend(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function __fn(superclass){
    var prototype = __extend(constructor, superclass).prototype;
    prototype.message = message;
    prototype.code = code;
    function constructor(){
      superclass.call(this, "Error " + code + ": " + message);
    }
    return constructor;
  }
}).call(this);
