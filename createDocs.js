const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')

jsdoc2md.render({ files: './dist/connection.js' })
.then(output => {
    fs.writeFileSync('./docs/connection.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/balances.js' })
.then(output => {
    fs.writeFileSync('./docs/balances.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/collective.js' })
.then(output => {
    fs.writeFileSync('./docs/collective.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/vc.js' })
.then(output => {
    fs.writeFileSync('./docs/vc.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/did.js' })
.then(output => {
    fs.writeFileSync('./docs/did.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/token.js' })
.then(output => {
    fs.writeFileSync('./docs/token.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/tokenchain.js' })
.then(output => {
    fs.writeFileSync('./docs/tokenchain.md', output)
})
.catch(console.error)

jsdoc2md.render({ files: './dist/utils.js' })
.then(output => {
    fs.writeFileSync('./docs/utils.md', output)
})
.catch(console.error)