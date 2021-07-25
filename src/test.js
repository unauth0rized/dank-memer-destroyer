let TokenSorter = require('./utility/TokenSorter').TokenSorter
let sorter = new TokenSorter(require('../config/tokens.json'), g => g.channels.cache.find(c => c.name === 'template'))
const sorted = sorter.Sort()