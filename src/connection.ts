import { ApiPromise, WsProvider } from '@polkadot/api';
import { METABLOCKCHAIN_PROVIDER } from './config';
import { METABLOCKCHAIN_TYPES } from './utils';

const NETWORK_PROVIDER = {
  local: METABLOCKCHAIN_PROVIDER.LOCAL,
  dev: METABLOCKCHAIN_PROVIDER.DEV,
  demo: METABLOCKCHAIN_PROVIDER.DEMO,
  testnet: METABLOCKCHAIN_PROVIDER.TESTNET,
  mainnet: METABLOCKCHAIN_PROVIDER.MAINNET,
};

let providerInstance: Promise<ApiPromise>;

function buildNewConnection(network = 'local'): Promise<ApiPromise> {
  if (!(network in NETWORK_PROVIDER)) throw new Error('Invalid Network!');

  const provider = new WsProvider(NETWORK_PROVIDER[network]);
  return ApiPromise.create({
    provider,
    types: METABLOCKCHAIN_TYPES,
  });
}

/**
 * Return an APIPromise object
 * @param {string} network MetaMUI network provider to connect
 * @param {boolean} ignoreCache (optional) (default=true)
 * @returns {ApiPromise} APIPromise object
 * Note : setting the ignoreCache value to true will create a new ws
 * ws conection on every call
 */
function buildConnection(network = 'local', ignoreCache = false): Promise<ApiPromise> {
  if (!providerInstance || ignoreCache) {
    console.log('Creating new websocket connection!');
    providerInstance = buildNewConnection(network);
  }
  return providerInstance;
}

/**
 * Return an APIPromise object
 * @param {string} wssUrl Tokenchain network wss URL to connect
 * @returns {ApiPromise} APIPromise object
 */
function buildConnectionByUrl(wssUrl: string, blockchainTypes?: any): Promise<ApiPromise> {
  if(!blockchainTypes) blockchainTypes = METABLOCKCHAIN_TYPES;
  const provider = new WsProvider(wssUrl);
    console.log('Creating new websocket connection via WSS URL!');
    return ApiPromise.create({
      provider,
      types: blockchainTypes,
    });
}

export {
  buildConnection,
  buildConnectionByUrl
};
