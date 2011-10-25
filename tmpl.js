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

exports.Tmpl = function(tmpl) {
	var cache, tmpl, str = '', arr = [];
	
	if (cache = jqotecache[tmpl]) return cache;
	
	arr = tmpl.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\n\r\t]/g, '')
	.split('{{').join('}}\x1b')
	.split('}}');

	for(let m=0,l=arr.length; m < l; m++) {
			if(arr[m].charAt(0) === '\x1b') {
				if(arr[m].charAt(1) === '=') {
					str += ';out+=(' + arr[m].substr(2) + ');';
				} else if(arr[m].charAt(1) === '!') {
					str += ';out+=encode((' + arr[m].substr(2) + '));';
				} else {
					str += ';' + arr[m].substr(1);
				}
			} else {
				str += "out+='" + arr[m].replace(/(\\|["'])/g, '\\$1') + "'";
			}
	}

	str = 'try{' +
		('var out="";'+str+';return out;')
			.split("out+='';").join('')
				.split('var out="";out+=').join('var out=') +
		'}catch(e){e.type="'+JQOTE2_TMPL_EXEC_ERROR+'";e.args=arguments;e.template=arguments.callee.toString();throw e;}';

	try {
		var fn = new Function('$,_', str);
	} catch (e) {
		raise(e,{name: JQOTE2_TMPL_COMP_ERROR,template:str});
	}

	return jqotecache[tmpl] = fn;
};