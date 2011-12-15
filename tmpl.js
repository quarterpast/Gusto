const vm = require("vm");
function encode(str) {
	return str.toString()
	.replace(/&(?!\w+;)/g, '&#38;')
	.split('<').join('&#60;').split('>').join('&#62;')
	.split('"').join('&#34;').split("'").join('&#39;');
}
function raise(error, ext) {
	for(var p in ext) {
		if(ext.hasOwnProperty(p))
			error[p] = ext[p];
	}
	throw error;
}

var jqotecache = {};

const JQOTE2_TMPL_UNDEF_ERROR = 'UndefinedTemplateError',
      JQOTE2_TMPL_COMP_ERROR  = 'TemplateCompilationError',
      JQOTE2_TMPL_EXEC_ERROR  = 'TemplateExecutionError',

      ARR  = '[object Array]',
      STR  = '[object String]',
      FUNC = '[object Function]',

      qreg = /^[^<]*(<[\w\W]+>)[^>]*$/;
exports.UNDEF_ERROR='UndefinedTemplateError';
exports.COMP_ERROR='TemplateCompilationError';
exports.EXEC_ERROR='TemplateExecutionError';
exports.compile = function(tmpl,file) {
	var cache, tmpl, str = '', arr = [], lines=0, pos = [];

	if (cache = jqotecache[tmpl]) return cache;

	arr = tmpl.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\t]/g, '')
	.split('{{').join('}}\x1b')
	.split('}}');

	for(let m=0,l=arr.length; m < l; m++) {
		let chunk = arr[m].split("\n").join("");
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
		'}catch(e){e.type="'+JQOTE2_TMPL_EXEC_ERROR+'";e.lines='+pos.toSource()+';e.args=[].slice.call(arguments);e.template='+tmpl.toSource()+';throw e;}';

	try {
		var fn = vm.createScript(str,file);
	} catch (e) {
		raise(e,{type: JQOTE2_TMPL_COMP_ERROR,template:tmpl,lines:pos});
	}

	return jqotecache[tmpl] = fn;
};
