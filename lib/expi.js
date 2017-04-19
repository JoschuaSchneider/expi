/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var invariant = require('invariant')
var module = require('./module')
var route = require('./route')



/**
 * expi constructor
 * @param  {app} app Express app instance
 * @return {expi}     expi instance
 */
function expi(app){

	let self = this

	this.app = app

	this._modules = new Map()

	Object.defineProperty(this, 'modules', {
		get: function(){
			let modules = {}
			Array.from(self._modules.entries()).forEach(function(entry){
				modules[entry[0]] = entry[1]
			})
			return modules
		},
		set: function(value){
			return false
		},
		configurable: false,
		enumerable: true,
	})
}

expi.prototype.register = function(modules){
	if(typeof modules !== 'object' && modules.constructor !== Array){
		throw new Error('modules has to be an array of expi modules')
	}
	modules.map(m => {
		if(m instanceof module === false){
			throw new Error('module has to be a valid module instance')
		}

		m.init(this)
	})
}

expi.prototype.registerModuleAs = function(handle, m){

	invariant(typeof handle === 'string', 'given handle must be a string')
	invariant(m instanceof module === true, 'given module must be a expi Module')
	invariant(!this._modules.get(handle), 'handles must be unique across all modules')

	this._modules.set(handle, m)
}

expi.prototype.listen = function(port, callback){
	Array.from(this._modules.entries()).forEach(m => {
		m[1].registerRoutes()
		this.app.use(m[1].path, m[1].router)
	})

	this.app.listen(port, callback)
}

exports.instance = expi