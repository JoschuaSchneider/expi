/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

module.exports = handle

function handle(expi, module, route, handler){

	return function(req, res, next){
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
			methods: module.methods,
			module: module,
			route: route,
			req: req,
			res: res,
			request: req._expi.request,
		}

		handler(inject)
	}
}