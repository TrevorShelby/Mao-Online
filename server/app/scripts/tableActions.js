class TableActions {
	constructor(tableConn) {
		this.tableConn = tableConn
	}


	act(actionName, args) {
		this.tableConn.send(JSON.stringify({
			type: 'action',
			name: actionName,
			args
		}))
	}
}