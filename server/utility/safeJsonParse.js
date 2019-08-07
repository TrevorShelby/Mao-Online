/*
 * Parses a possible JSON string.
 * @param {string} objStr - The string being parsed.
 * @returns {Object|string} The parsed JSON string, or, if the string wasn't a JSON object, the
 * string. 
*/
function safeJsonParse(objStr) {
	let obj
	try {
		obj = JSON.parse(objStr)
	}
	catch(err) {
		obj = objStr
	}
	return obj
}



module.exports = safeJsonParse