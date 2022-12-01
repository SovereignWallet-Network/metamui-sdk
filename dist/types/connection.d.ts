import { ApiPromise } from '@polkadot/api';
/**
 * Return an ApiPromise object
 * @param {string} network MetaMUI network provider to connect
 * @param {boolean} ignoreCache (optional) (default=true)
 * @returns {ApiPromise} ApiPromise object
 * Note : setting the ignoreCache value to true will create a new ws
 * ws conection on every call
 */
declare function buildConnection(network?: string, ignoreCache?: boolean): Promise<ApiPromise>;
/**
 * Return an ApiPromise object
 * @param {string} wssUrl Tokenchain network wss URL to connect
 * @returns {ApiPromise} ApiPromise object
 */
declare function buildConnectionByUrl(wssUrl: string, blockchainTypes?: any): Promise<ApiPromise>;
export { buildConnection, buildConnectionByUrl };
