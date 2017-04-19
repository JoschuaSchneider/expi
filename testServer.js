var express = require('express')
var Expi = require('./lib')

var { Module, Route, Method } = Expi

var app = Expi(express())

var module1 = new Module({
	path: '/',
	name: 'First Module',
	version: '1.0.0',
	routes: [
		new Route({
			method: 'GET',
			path: '/test',
			handler: function(api){
				console.log('Handler called')
				api.dispatch({
					hallo: 'welt'
				})
			}
		})
	],
	methods: [],
})


var module2 = new Module({
	path: '/module2',
	name: 'Some Module',
	version: '2.0.0',
	routes: [
		new Route({
			method: 'POST',
			path: '/test',
			handler: function(api){
				
				api.dispatch({
					test: 'Method return value: ' + api.methods.get('testMethod')('SomeArg')
				})
			},
			validation: {
				request: schema => schema.object().keys({
					test: schema.string().required()
				}),
				response: schema => schema.object().keys({
					test: schema.string().required()
				})
			}
		})
	],
	methods: [
		new Method('testMethod', function(arg){
			console.log('Some method called with', arg)
			return 5
		})
	],
})

app.register([
	module1,
	module2
])

app.listen(3000, function(err){
	console.log(err)
})