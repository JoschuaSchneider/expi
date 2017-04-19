/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var invariant = require('invariant')
var Joi = require('joi')

var initialMiddleware = require('./middlewares/initial')
var finalMiddleware = require('./middlewares/final')
var handleMiddleware = require('./middlewares/handle')

module.exports = Route

function Route(options){
	options = Object.assign({
		method: 'GET',
		path: null,
		handler: null,
		validation: {
			request: null,
			response: null
		},
	}, options)

	this.requestValidation = null
	this.responseValidation = null

	invariant(['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'].indexOf(options.method) > -1, 'Route method must be one of GET, POST, PUT, UPDATE or DELETE')
	invariant(typeof options.path === 'string', 'Route must have a path of type string')
	invariant(typeof options.handler === 'function', 'Route must have a handler function')

	/**
	 * Setup request Validation if defined
	 */
	if(options.validation && typeof options.validation === 'object' && options.validation.request){
		if(typeof options.validation.request === 'function'){
			this.requestValidation = options.validation.request(Joi)
		}else{
			this.requestValidation = options.validation.request
		}
	}


	/**
	 * Setup response Validation if defined
	 */
	if(options.validation && typeof options.validation === 'object' && options.validation.response){
		if(typeof options.validation.response === 'function'){
			this.responseValidation = options.validation.response(Joi)
		}else{
			this.responseValidation = options.validation.response
		}
	}


	this.method = options.method
	this.path = options.path
	this.handler = options.handler

}

Route.prototype.init = function(expi, module){

	let middlewareStack = [
		initialMiddleware(expi, module, this),
		handleMiddleware(expi, module, this, this.handler)
	]



	middlewareStack.push(finalMiddleware(expi, module, this))

	module.router[this.method.toLowerCase()](this.path ,middlewareStack)
}

Route.prototype.validateRequest = function(request){
	if(!this.requestValidation) return null
	return Joi.validate(request, this.requestValidation).error
}

Route.prototype.validateResponse = function(response){
	if(!this.responseValidation) return null
	return Joi.validate(response, this.responseValidation).error
}