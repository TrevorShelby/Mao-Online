const uuidv4 = require('uuid/v4')


function uuidTime() {
	const uuidStart = Date.now()
	uuidv4()
	return Date.now() - uuidStart
}

function objTime() {
	const objStart = Date.now()
	new Object()
	return Date.now() - objStart
}


console.time('uuid')
for(let i = 0; i < 1000; i++) {
	uuidv4()
}
console.timeEnd('uuid')

console.time('obj')
for(let i = 0; i < 100; i++) {
	new Object()
}
console.timeEnd('obj')


// let uuidTimeTotal = 0
// uuidTimes.forEach( (uuidTime) => {
// 	uuidTimeTotal += uuidTime
// })
// const uuidAvg = uuidTimeTotal/uuidTimes.length

// let objTimeTotal = 0
// objTimes.forEach( (objTime) => {
// 	objTimeTotal += objTime
// })
// const objAvg = objTimeTotal/objTimes.length


// console.log('uuid average: ' + uuidAvg)
// console.log(' obj average: ' + objAvg)
