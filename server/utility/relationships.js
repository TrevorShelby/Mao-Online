//table indexes to roundes
const rounds = new Map()

//rounds to sets of player indexes
const playerIndexes = new Map()

//rounds and player indexes to action pools
const actionPools = new Map()

//rounds and player indexes to player connections
const playerConnections = new Map()

//rounds and player indexes to message histories
const messageHistories = new Map()

//rounds to chatlogs
const chatLogs = new Map()


module.exports.rounds = rounds
module.exports.playerIndexes = playerIndexes
module.exports.actionPools = actionPools
module.exports.playerConnections = playerConnections
module.exports.messageHistories = messageHistories
module.exports.chatLogs = chatLogs