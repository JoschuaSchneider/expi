/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var invariant = require('invariant')

var _ = require('lodash')
var Joi = require('joi')

function Module(opts){
	let options = Object.assign({
		path: '/',
		name: null,
		version: null
	}, opts || {})

	/**
	 * Required options validation
	 */
	invariant(typeof options === 'object', 'Module options must be an object')
	invariant(typeof options.name === 'string', 'Module options.name is required and has to be a string')
	invariant(typeof options.version === 'string', 'Module options.version is required and has to be a string')
	invariant(typeof options.path === 'string', 'Module options.path is required and has to be a string')
	invariant(typeof options.routes === 'object' && options.routes.constructor === Array, 'Module options.routes is required and has to be an array')

	/**
	 * Optional options validation
	 */
	invariant(typeof options.validate === 'object' || typeof options.validate === 'undefined', 'Module options.validate has to be an object')
	invariant(typeof options.middleware === 'object' || typeof options.middleware === 'undefined', 'Module options.middleware has to be an object')
	invariant(typeof options.methods === 'undefined' || (typeof options.methods === 'object' && options.methods.constructor === Array), 'Module options.methods has to be an array')

	this.super = null

	this.router = null

	options.validate = options.validate || {}
	options.methods = options.methods || []
	options.middleware = Object.assign({
		preRoutes: [],
		postRoutes: []
	}, options.middleware || {})

	if(options.middleware.preRoutes && options.middleware.preRoutes.constructor !== Array)
		throw new Error('Module options.middleware.preRoutes has to be an array')
	if(options.middleware.postRoutes && options.middleware.postRoutes.constructor !== Array)
		throw new Error('Module options.middleware.postRoutes has to be an array')

	this._methods = {}

	this._options = options
}

Module.prototype._init = function(expi){

	this.super = expi

	this.router = this.super.express.Router()

	this._applyMethods()

	this._setPreRoutesMiddleware(this._options.middleware.preRoutes)

	this._applyRoutes()

	this._setPostRoutesMiddleware(this._options.middleware.postRoutes)

	if(this._options.path === '*') {
		this.super.app.use(this._options.path, this.router)
	}else{
		this.super.app.use(this._options.path, this.router)
	}

	return this
}

Module.prototype._setPreRoutesMiddleware = function(middlewares){

	middlewares.map(middleware => {
		this.router.use(middleware)
	})

}

Module.prototype._setPostRoutesMiddleware = function(middlewares){

	middlewares.map(middleware => {
		this.router.use(middleware)
	})

}

Module.prototype._applyRoutes = function(){

	this._options.routes.map(route => {
		return route._init(this)
	})

}

Module.prototype._applyMethods = function(){

	this._options.methods.map(method => {
		if(this._methods[method.name]) throw new Error('Method "' + method.name + '" already exists on module "' + this._options.name + '"')
		this._methods[method.name] = method.invoke.bind(method)
	})

}

Module.prototype.method = function(name){
	return this._methods[name]
}

exports = module.exports = Module