function funcA(arg1, cb) {
	const res1 = arg1 + 1
	cb(res1)
}

function funcB(cb) {
	const res1 = "hello"
    const res2 = "world"
    cb(res1, res2)
}

function funcC(arg1, cb) {
    const res1 = arg1 + arg1
    cb(res1)
}


//These partial applications pass the second result of funcB as the primary argument for funcC.
const unappliedCbForC = (aRes1) => (bRes1, bRes2) => (cRes1) => {
	console.log("A: " + aRes1)
	console.log("B: " + bRes1 + ", " + bRes2)
    console.log("C: " + cRes1)
}

const unappliedCbForB = (aRes1) => (bRes1, bRes2) => {
	let cbForC = unappliedCbForC(aRes1)(bRes1, bRes2)
	funcC(bRes2, cbForC)
}

const unappliedCbForA = (aRes1) => {
	let cbForB = unappliedCbForB(aRes1)
	funcB(cbForB)
}


const applyAll = (aArg1) => {
	funcA(aArg1, unappliedCbForA)
}