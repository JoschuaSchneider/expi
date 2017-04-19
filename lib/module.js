/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

var invariant = require('invariant')
var express = require('express')

var Route = require('./route')
var Method = require('./method')

function Module(options){
	options = Object.assign({
		path: '/',
		routes: [],
		methods: [],
		name: null,
		version: null,

	}, options)

	invariant(typeof options.path === 'string', 'Module must have a path of type string')
	invariant(typeof options.name === 'string', 'Module must have a name of type string')
	invariant(typeof options.version === 'string', 'Module must have a version of type string')
	invariant(typeof options.routes === 'object' && options.routes.constructor === Array, 'Module endpoints must be an array')
	invariant(typeof options.methods === 'object' && options.methods.constructor === Array, 'Module methods must be an array')

	this.path = options.path
	this.router = express.Router()
	this.routes = options.routes
	this._methods = options.methods
	this._methodMap = new Map()

	this.methods = {}


	this.name = options.name
	this.version = options.version
	this.expi = null
}

Module.prototype.init = function(expi){
	this.expi = expi
	expi.registerModuleAs(this.name, this)
	this.registerMethods()
}

Module.prototype.registerMethods = function(){
	var self = this

	this._methods.map(method => {
		if(method instanceof Method === false) throw new Error('Methods must be valid expi Method instances')
		self._methodMap.set(method.key, method.handler)
		Object.defineProperty(self.methods, method.key, {
			get: function(){
				return method.handler
			},
			set: function(value){
				return false
			},
			configurable: false,
			enumerable: true
		})
	})

	Object.defineProperty(self.methods, 'get', {
		get: function(){
			return function(key){
				if(self.methods[key]) return self.methods[key]
				return null
			}
		},
		set: function(value){
			return false
		},
		configurable: false,
		enumerable: false
	})
}

Module.prototype.registerRoutes = function(){
	this.routes.map(route => {
		if(route instanceof Route === false) throw new Error('Routes must be valid expi Route instances')
		route.init(this.expi, this)
	})
}

module.exports = Module