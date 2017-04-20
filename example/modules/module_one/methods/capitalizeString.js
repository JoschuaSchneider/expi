var Method = require('../../../../').Method

module.exports = new Method('capitalizeString', function(string){
	return string.toUpperCase()
})