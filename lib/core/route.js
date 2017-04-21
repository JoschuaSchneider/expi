/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var invariant = require('invariant')

var Joi = require('joi')

var initialMiddleware = require('../middlewares/initial')
var handleMiddleware = require('../middlewares/handle')
var finalMiddleware = require('../middlewares/final')

function Route(opts){
	let options = Object.assign({
		path: '/',
		method: 'GET',
		handler: api => api.next(),
		disableExpiMiddleware: false
	}, opts || {})

	/**
	 * Required options validation
	 */
	invariant(typeof options === 'object', 'Route options must be an object')
	invariant(typeof options.path === 'string', 'Route options.path is required and has to be a string')
	invariant(typeof options.method === 'string' && ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE', 'ALL', '*'].indexOf(options.method.toUpperCase()) > -1, 'Route options.method has to be one of GET, POST, PUT, UPDATE, DELETE')

	/**
	 * Optional options validation
	 */
	invariant(typeof options.validate === 'object' || typeof options.validate === 'undefined', 'Route options.validate has to be an object')
	invariant(typeof options.handler === 'function' || typeof options.handler === 'undefined', 'Route options.handler has to be a function')
	invariant(typeof options.middleware === 'object' || typeof options.middleware === 'undefined', 'Route options.middleware has to be an object')
	invariant(typeof options.disableExpiMiddleware === 'boolean' || typeof options.disableExpiMiddleware === 'undefined', 'Route options.disableExpiMiddleware has to be a boolean')

	this.super = null
	this.module = null

	this.requestValidator = null
	this.responseValidator = null

	options.validate = options.validate || {}
	options.methods = options.methods || []
	options.disableExpiMiddleware = options.disableExpiMiddleware === true? true : false
	options.middleware = Object.assign({
		preHandler: [],
		postHandler: []
	}, options.middleware || {})

	if(options.middleware.preHandler && options.middleware.preHandler.constructor !== Array)
		throw new Error('Route options.middleware.preHandler has to be an array')
	if(options.middleware.postHandler && options.middleware.postHandler.constructor !== Array)
		throw new Error('Route options.middleware.postHandler has to be an array')

	/**
	 * Check provided request validator and set it up
	 */
	if(options.validate && options.validate.request){
		if(typeof options.validate.request === 'function'){
			this.requestValidator = options.validate.request(Joi)
		}else{
			this.requestValidator = options.validate.request
		}
	}

	/**
	 * Check provided response validator and set it up
	 */
	if(options.validate && options.validate.response){
		if(typeof options.validate.response === 'function'){
			this.responseValidator = options.validate.response(Joi)
		}else{
			this.responseValidator = options.validate.response
		}
	}

	this._options = options
}

Route.prototype._init = function(module){

	this.super = module.super
	this.module = module

	this._applyToRouter()

}

Route.prototype._applyToRouter = function(){

	this.module.router[this._options.method === '*'? 'all' : this._options.method.toLowerCase()](this._options.path,
		initialMiddleware(this, this._options.disableExpiMiddleware),
		this._options.middleware.preHandler,
		handleMiddleware(this, this._options.handler, this._options.disableExpiMiddleware),
		this._options.middleware.postHandler,
		finalMiddleware(this, this._options.disableExpiMiddleware)
	)

}

Route.prototype.validateRequest = function(request){
	if(!this.requestValidator) return { error: null, value: request }
	return Joi.validate(request, this.requestValidator, { abortEarly: false })
}

Route.prototype.validateResponse = function(response){
	if(!this.responseValidator) return { error: null, value: response }
	return Joi.validate(response, this.responseValidator, { abortEarly: false })
}

module.exports = Route