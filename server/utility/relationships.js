//table indexes to roundes
const rounds = new Map()

//TODO: Currently unused, but requires implementation in the future. This relationship is player
//connections to player ids. Once implemented, playerIndexes should be changed to playerSeats so
//the distinction is more obvious. That distinction being that playerIDs are unique to a player,
//whereas playerSeats just represent an player-occupied space at the table. More things might need
//to be changed, but basically, the big problem is figuring out when it is important to tell
//players apart from one another, and when it is important to tell seats apart from one another (
//which might be never)
const playerIDs = new Map()

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