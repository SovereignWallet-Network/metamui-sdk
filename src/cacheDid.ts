import { ApiPromise } from '@polkadot/api';
import { hexToString } from './utils';
import { buildConnection } from './connection';
import { sanitiseDid } from './did';

/**
 * Get Did Type from Mapping
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} Did Type
 */
async function getDidType(did: String, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return (await provider.query.cacheDid.didTypeMap(sanitiseDid(did))).toString();
}

/**
 * Get mapped public key from Did
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} Public Key Hex
 */
async function getPublicKey(did: String, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return (await provider.query.cacheDid.publicKeyMap(sanitiseDid(did))).toString();
}

/**
 * Lookup Cached Did
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} AccountId
 */
async function lookup(did: String, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return (await provider.query.cacheDid.lookup(sanitiseDid(did))).toString();
}

/**
 * Reverse Lookup Cached Did
 * @param {String} accountId
 * @param {ApiPromise} api
 * @returns {String} Did
 */
async function reverseLookup(accountId: String, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return hexToString( (await provider.query.cacheDid.rLookup(accountId)).toString());
}

export {
    getDidType,
    getPublicKey,
    lookup,
    reverseLookup,
}