//global.uncaughtExceptions = []
process.on('uncaughtException', async (err) => {
  //global.uncaughtExceptions.push(err.toString() + "\n" + err.stack)
  require('./src/utility/logger.js').error(err.toString())
})
process.on('unhandledRejection', async (reason, p) => {
  //global.uncaughtExceptions.push(reason.toString())
  require('./src/utility/logger.js').error(reason.toString())
})
const logger = require('./src/utility/logger.js')
async function main() {
  const ServerManager = require('./src/ServerManager')
  const SM = new ServerManager(require('./config/tokens.json'), require('./config/activeHours.json'),"852677579827314708")
  logger.log('Initialization sequence: Sorting tokens..')
  await SM.Sort()
  logger.log('Initialization sequence: Setting up hooks..')
  await SM.SetupWorkership()
  logger.log('Initialization sequence: Waking up workers..')
  await SM.StartWorkership()
}

main()

/*const ClientManager = require('./src/ClientManager')
const manager = new ClientManager(require('./config/tokens.json'), require('./config/activeHours.json'), "867806640852697118", "852677579827314708")
manager.SetupWorkership()
manager.StartWorkership()*/