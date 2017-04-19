/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var invariant = require('invariant')

module.exports = Method

function Method(key, handler){

	invariant(typeof key === 'string', 'Method key must be a string')
	invariant(typeof handler === 'function', 'Method handler must be a function')

	this.key = key
	this.handler = handler
}