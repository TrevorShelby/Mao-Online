class BiMap {
	constructor(keys=undefined, values=undefined) {
		this.keys = keys == undefined ? [] : keys
		this.values = values == undefined ? [] : values
	}


	getValue(key) {
		const index = this.keys.indexOf(key)
		return this.values[index]
	}
	get(key) {
		return this.getValue(key)
	}


	getKey(value) {
		const index = this.values.indexOf(value)
		return this.keys[index]
	}


	setValue(key, newValue) {
		const index = this.keys.indexOf(key)
		if(index != -1) {
			this.values[index] = newValue
		}
		else {
			this.keys.push(key)
			this.values.push(newValue)
		}
	}
	set(key, newValue) {
		this.setValue(key, newValue)
	}


	setKey(value, newKey) {
		const index = this.values.indexOf(value)
		if(index != -1) {
			this.keys[index] = newKey
		}
		else {
			this.values.push(value)
			this.keys.push(newKey)
		}
	}


	//key and value must be unique to their sets
	add(key, value) {
		this.keys.push(key)
		this.values.push(value)
	}


	//elemIsKey is boolean. should be true if elem is the key from the pair being removed and false
	//if elem is the value from the pair being removed.
	delete(elem, elemIsKey=true) {
		let index
		if(elemIsKey) {
			index = this.keys.indexOf(elem)
		}
		else {
			index = this.values.indexOf(elem)
		}
		this.keys.splice(index, 1)
		this.values.splice(index, 1)
	}


	//callback takes in the current key, value, and index, and can return true if the internal
	//for-loop should be broken.
	forEach(callback) {
		for(let index = 0; index < this.keys.length; index++) {
			const shouldBreak = callback(this.keys[index], this.values[index], index)
			if(shouldBreak) {break}
		}
	}


	hasKey(key) {
		return this.keys.includes(key)
	}


	hasValue(value) {
		return this.values.includes(value)
	}
}



module.exports.BiMap = BiMap