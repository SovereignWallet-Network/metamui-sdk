import { ApiPromise } from '@polkadot/api';
/**
 * Return an APIPromise object
 * @param {string} network MetaMUI network provider to connect
 * @param {boolean} ignoreCache (optional) (default=true)
 * Note : setting the ignoreCache value to true will create a new ws
 * ws conection on every call
 */
declare function buildConnection(network?: string, ignoreCache?: boolean): Promise<ApiPromise>;
export { buildConnection, };
