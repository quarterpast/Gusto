exports.if = function _if (cond, h, _else) {
	if (cond && cond != undefined) { // We need undefined condition for E4X
		return h(cond);
	}
	else if (_else) {
		return _else(cond);
	}
	return ''; // Empty string allows conditions in attribute as well as element content
}