/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

'use strict';

var express = require('express')
var bodyParser = require('body-parser')
var expi 	= require('./expi')

var Module = require('./module')
var Route = require('./route')
var Method = require('./method')

exports = module.exports = create

exports.Module = Module
exports.Route = Route
exports.Method = Method

function create(){
	var app = express()

	app.use(bodyParser.json())

	return new expi.instance(app)
}