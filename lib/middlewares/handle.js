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
			dispatch: function(data){
				req._expi.response = data
				return next()
			},
			error: function(message, status){
				if(!status) status = 200
				req._expi.errors.push(new Error(message))
				return next()
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