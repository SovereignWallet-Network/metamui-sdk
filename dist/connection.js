"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConnection = void 0;
const api_1 = require("@polkadot/api");
const config_1 = require("./config");
const utils_1 = require("./utils");
// assign network
const NETWORK_PROVIDER = {
    local: config_1.METABLOCKCHAIN_PROVIDER.LOCAL,
    dev: config_1.METABLOCKCHAIN_PROVIDER.DEV,
    demo: config_1.METABLOCKCHAIN_PROVIDER.DEMO,
    testnet: config_1.METABLOCKCHAIN_PROVIDER.TESTNET,
    mainnet: config_1.METABLOCKCHAIN_PROVIDER.MAINNET,
};
// global obj to cache ws connection
let providerInstance;
function buildNewConnection(network = 'local') {
    if (!(network in NETWORK_PROVIDER))
        throw new Error('Invalid Network!');
    const provider = new api_1.WsProvider(NETWORK_PROVIDER[network]);
    return api_1.ApiPromise.create({
        provider,
        types: utils_1.METABLOCKCHAIN_TYPES,
    });
}
/**
 * Return an APIPromise object
 * @param {string} network MetaMUI network provider to connect
 * @param {boolean} ignoreCache (optional) (default=true)
 * Note : setting the ignoreCache value to true will create a new ws
 * ws conection on every call
 */
function buildConnection(network = 'local', ignoreCache = false) {
    if (!providerInstance || ignoreCache) {
        console.log('Creating new websocket connection!');
        providerInstance = buildNewConnection(network);
    }
    return providerInstance;
}
exports.buildConnection = buildConnection;
