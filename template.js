exports.if = function _if (cond, h, _else) {
	if (cond && cond != undefined) { // We need undefined condition for E4X
		return h(cond);
	}
	else if (_else) {
		return _else(cond);
	}
	return ''; // Empty string allows conditions in attribute as well as element content
}
exports.node = function(name,attr,cont) {
	var out = <><{name}/></>;
	for(let [k,v] in Iterator(attr)) {
		out.@[k] = v;
	}
	out[name][0] = cont;
	return out[name];
}