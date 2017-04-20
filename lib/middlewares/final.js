/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

module.exports = final

function final(route, disabled){

	return function(req, res, next){
		if(disabled) return next()
		
		let response = {
			meta: {
				module: route.module._options.name,
				version: route.module._options.version,
			},
			errors: null,
			payload: null,
		}

		let responseValidationError = route.validateResponse(req._expi.response)

		if(responseValidationError){
			req._expi.errors.push(new Error('Response Validation Error'))
		}else{
			response.payload = req._expi.response
		}

		if(req._expi.errors.length > 0){
			response.errors = req._expi.errors.map(error => {
				return {
					name: error.name,
					message: error.message
				}
			})
			return dispatch()
		}

		return dispatch()

		function dispatch(){
			res.json(response)
			return next()
		}
	}
	
}