const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')

let modules = [
    "balances",
    "cacheDid",
    "collective",
    "connection",
    "did",
    "kycUtils",
    "token",
    "tokenchain",
    "utils",
    "vc"
]

for (let module of modules) {
    jsdoc2md.render({ files: `./dist/${module}.js` })
    .then(output => {
        fs.writeFileSync(`./docs/${module}.md`, output)
    })
    .catch(console.error)
}