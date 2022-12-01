import { ApiPromise } from '@polkadot/api';
/**
 * Get Did Type from Mapping
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} Did Type
 */
declare function getDidType(did: String, api: ApiPromise): Promise<string>;
/**
 * Get mapped public key from Did
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} Public Key Hex
 */
declare function getPublicKey(did: String, api: ApiPromise): Promise<string>;
/**
 * Lookup Cached Did
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} AccountId
 */
declare function lookup(did: String, api: ApiPromise): Promise<string>;
/**
 * Reverse Lookup Cached Did
 * @param {String} accountId
 * @param {ApiPromise} api
 * @returns {String} Did
 */
declare function reverseLookup(accountId: String, api: ApiPromise): Promise<string>;
export { getDidType, getPublicKey, lookup, reverseLookup, };
