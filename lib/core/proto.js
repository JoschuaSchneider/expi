/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var bodyParser = require('body-parser')

var expi = {}

expi.init = function(config){
	if(this._initialized) throw new Error('Cannot initialize expi twice')

	this.app = this.express()

	this.app.use(bodyParser.json())

	this._validateConfig(config)

	this.setOption('port', config.port || 3000)

	this._initialized = true

	Object.defineProperty(this, 'use', {
		value: this.app.use.bind(this.app)
	})

	Object.defineProperty(this, 'static', {
		value: this.app.static.bind(this.app)
	})

	Object.defineProperty(this, 'set', {
		value: this.app.set.bind(this.app)
	})

	Object.defineProperty(this, 'use', {
		value: this.app.use.bind(this.app)
	})
}


expi._validateConfig = function(config){

	config = config || {}
	let missing = []
	let invalid = []

	let requiredFields = {
		port: Number,
	}

	Object.keys(requiredFields).forEach(key => {
		if(typeof config[key] === 'undefined') return missing.push(key)
		if(typeof config[key] === 'number' && requiredFields[key] !== Number) return invalid.push(key)
		if(typeof config[key] === 'string' && requiredFields[key] !== String) return invalid.push(key)
	})

	if(missing.length){
		throw new Error('Invalid expi configuration. Missing fields: ' + missing.join(', '))
	}else if(invalid.length){
		throw new Error('Invalid expi configuration. Expected types for fields: ' + invalid.map(key => `${key}<${requiredFields[key].name}>`).join(', '))
	}

	return null
}

expi.register = function(modules){

	modules = modules || []

	if(!this._initialized) return initializeFirst()

	if(modules.constructor !== Array) throw new Error('expi.register([Module, ...]) accepts an array of expi modules')

	modules.map(mod => {
		let m = mod._init(this)
		if(this._modules[m._options.name]) throw new Error('Duplicate module name "' + m._options.name + '"')
		this._modules[m._options.name] = m
	})
}

expi.globals = function(methods){
	if(!this._initialized) return initializeFirst()

	if(modules.constructor !== Array) throw new Error('expi.globals([Method, ...]) accepts an array of expi methods')

	methods.map(method => {
		if(this._globals[method.name]) throw new Error('Method "' + method.name + '" already exists globaly')
		this._globals[method.name] = method.invoke
	})
}

expi.global = function(name){
	return this._globals[name]
}

expi.listen = function(){

	if(!this._initialized) return initializeFirst()

	return new Promise((resolve, reject) => {
		this.app.listen(this.getOption('port'), err => {
			if(err) return reject(err)
			return resolve()
		})
	})
}

function initializeFirst(){
	throw new Error('expi has to be initialized first. Use `expi.init({config})`')
}

module.exports = expi