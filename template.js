exports.if = function _if (cond, h, _else) {// cheers, MDC
	if (cond && cond != undefined) { // We need undefined condition for E4X
		return h(cond);
	}
	else if (_else) {
		return _else(cond);
	}
	return ''; // Empty string allows conditions in attribute as well as element content
};
exports.node = function(name,attr,cont) {// in Rhino 1.7R3, you can't embed XML in XML
	var out = <><{name}/></>;
	for(let [k,v] in Iterator(attr)) {
		out.@[k] = v;
	}
	out[name][0] = cont;
	return out[name];
};
exports.include = function(template,args) {
	var template = require("app/views/"+template+".ejs").template;
	return template.call(args,exports).toXMLString();
};