exports.routes = function($) [
	["GET", "/favicon/ico"           , this.staticFile("static/favicon.ico") ],
	["*"  , "/static/{file}"         , this.staticDir("static")              ],
	["GET", "/posts"                 , function() $.posts.index              ],
	["*"  , "/{controller}/{action}" , function(_) $[_.controller][_.action] ]
]