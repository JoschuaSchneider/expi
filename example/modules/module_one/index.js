var Module = require('../../../').Module

module.exports = new Module({
	name: 'Module 1',
	version: '1.0.0',
	path: '/module1',
	routes: [
		require('./routes/route_one')
	],
	methods: [
		require('./methods/capitalizeString')
	]
})