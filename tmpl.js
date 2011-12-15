const vm = require("vm");
function encode(str) {
	return str.toString()
	.replace(/&(?!\w+;)/g, '&#38;')
	.split('<').join('&#60;').split('>').join('&#62;')
	.split('"').join('&#34;').split("'").join('&#39;');
}
function raise(error, ext) {
	throw error.merge(ext);
}

var jqotecache = {};

const qreg = /^[^<]*(<[\w\W]+>)[^>]*$/;

exports.UNDEF_ERROR='UndefinedTemplateError';
exports.COMP_ERROR='TemplateCompilationError';
exports.EXEC_ERROR='TemplateExecutionError';

exports.compile = function(tmpl,file) {
	var cache, tmpl, str = '', arr = [], lines=0, pos = [];

	if (cache = jqotecache[tmpl]) return cache;

	arr = tmpl.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\t]/g, '')
	.split('{{').join('}}\x1b')
	.split('}}');

	for(var m=0,l=arr.length; m < l; ++m) {
		var chunk = arr[m].split("\n").join("");
		if(chunk.charAt(0) === '\x1b') {
			pos.push(lines);
			if(chunk.charAt(1) === '=') {
				str += ';out+=(' +chunk.substr(2) + ');';
			} else if(chunk.charAt(1) === '!') {
				str += ';out+=encode((' + chunk.substr(2) + '));';
			} else {
				str += ';' + chunk.substr(1);
			}
		} else {
			str += "out+='" + chunk.replace(/(\\|["'])/g, '\\$1') + "'";
		}
		lines += arr[m].split("\n").length-1;
	}
	str = 'try{' +
		('var out="";'+str+';return out;')
			.split("out+='';").join('')
				.split('var out="";out+=').join('var out=') +
		'}catch(e){e.type="'+exports.EXEC_ERROR+'";e.lines='+pos.toSource()+';e.args=[].slice.call(arguments);e.template='+tmpl.toSource()+';throw e;}';

	try {
		var fn = vm.createScript(str,file);
	} catch (e) {
		raise(e,{type: exports.COMP_ERROR,template:tmpl,lines:pos});
	}

	return jqotecache[tmpl] = fn;
};
