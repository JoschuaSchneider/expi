/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */
var _ = require('lodash')

var EventEmitter = require('events').EventEmitter
var express = require('express')

/**
 * expi constructor
 */
function Expi(){

	EventEmitter.call(this)

	this.express = express

	this._options = {}

	this._modules = {}

	this._globals = {}

	this._initialized = false
}

_.extend(Expi.prototype, EventEmitter.prototype)
_.extend(Expi.prototype, require('./core/options'))
_.extend(Expi.prototype, require('./core/proto'))


exports = module.exports = new Expi()

exports.Module = require('./core/module')
exports.Route = require('./core/route')
exports.Method = require('./core/method')