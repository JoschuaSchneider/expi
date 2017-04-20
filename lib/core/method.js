var invariant = require('invariant')

function Method(name, handler){
	invariant(typeof name === 'string', 'Method name has to be a string')
	invariant(typeof handler === 'function', 'Method handler must be a function')

	this.name = name
	this.handler = handler
}

Method.prototype.invoke = function(){
	return this.handler.apply(null, arguments)
}

exports = module.exports = Method