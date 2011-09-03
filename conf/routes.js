exports.routes = function($) [
	["GET","/posts",function() $.posts.index],
	["*","/{controller}/{action}",function(_) $[_.controller][_.action]]
]