var Route = require('../../../../').Route

module.exports = new Route({
	path: '/route1',
	middleware: {
		preHandler: [
			function(req, res, next){
				console.log('I get called after expi middleware, but before the handler!')
				return next()
			}
		],
		postHandler: [
			function(req, res, next){
				console.log('I get called after the handler but before the final expi middleware!')
				return next()
			}
		]
	},
	handler: function(api){
		return api.dispatch({
			hello: api.module.method('capitalizeString')('world!')
		})
	}
})