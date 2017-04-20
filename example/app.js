var expi = require('../') //Require the expi module, when installed use require('expi')

/**
 * Initialize expi with options,
 * always do this before configuring anything else!
 * Attempting to for example register modules when not initialized will throw an error
 */

expi.init({
	port: 3000
})


expi.register([
	require('./modules/module_one'),
	//require('./modules/module_two'),
	//require('./modules/module_three')
])

expi.listen()
	.then(() => {
		//Success!
	})
	.catch(err => {
		//Failure
	})