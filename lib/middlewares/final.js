/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

module.exports = final

function final(expi, module, route){

	return function(req, res, next){
		
		let response = {
			meta: {
				module: module.name,
				version: module.version,
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
			return res.json(response)
		}
	}
	
}