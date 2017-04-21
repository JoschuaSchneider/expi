/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

module.exports = handle

function handle(route, handler, disabled){

	return function(req, res, next){
		if(disabled) return next()

		if(req._expi.errors.length > 0) return next()

		let inject = {
			dispatch: function(data, status){
				status = status || 200
				req._expi.response = data
				req._expi.httpStatus = status
				return next()
			},
			error: function(message, status){
				status = status || 500
				req._expi.errors.push(new Error(message))
				req._expi.httpStatus = status
				return next()
			},
			throw: function(error, status){
				status = status || 500
				req._expi.errors.push(error)
				req._expi.httpStatus = status
				return next()
			},
			status: function(status){
				req._expi.httpStatus = status
			},
			next: function(){
				return next()
			},
			module: route.module,
			global: route.super.global,
			req: req,
			res: res,
			request: req._expi.request,
		}

		handler(inject)
	}
}