/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

exports.setOption = function(key, value){
	return this._options[key] = value
}

exports.getOption = function(key){
	return this._options[key]
}