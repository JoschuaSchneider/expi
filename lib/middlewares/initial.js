/*
 * expi
 * Copyright(c) 2017 snoutnet GmbH
 * Copyright(c) 2017 Joschua Schneider
 * MIT Licensed
 */

module.exports = initial

function initial(route, disabled){

	return function(req, res, next){
		if(disabled) return next()

		let request = null

		req._expi = {
			module: route.module.name,
			errors: [],
			request: null,
			response: null,
			httpStatus: 200
		}
		
		if(typeof req.body === 'string'){
			try{
				request = JSON.parse(req.body)
			}catch(e){
				req._expi.errors.push(new Error('Request parsing Error. Request must be valid JSON'))
			}
		}else if(typeof req.body === 'object'){
			request = req.body
		}

		req._expi.request = request

		let requestValidation = route.validateRequest(request)

		if(requestValidation.error){
			req._expi.errors.push(requestValidation.error)
		}else{
			req._expi.request =requestValidation.value
		}
		

		return next()
	}
	
}