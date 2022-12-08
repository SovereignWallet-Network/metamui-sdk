import { ApiPromise } from '@polkadot/api';
import { AnyJson } from '@polkadot/types/types';
import { KeyringPair } from '@polkadot/keyring/types';
/** Generate Mnemonic
 * @returns {string} Mnemonic
 */
declare const generateMnemonic: () => string;
/**
 * Store the generated DID VC
 * @param {HexString} vcId
 * @param {number|string|null} syncTo - is null for relay chain. Pass valid paraId
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function createPrivate(vcId: any, syncTo: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Create Private DID and store the generated DID object in blockchain
 * @param {HexString} vcId
 * @param {number|string} syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function createPublic(vcId: any, syncTo: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Get did information from accountID
 * @param {string} identifier DID Identifier
 * @param {ApiPromise} api
 * @returns {JSON} DID Information
 */
declare function getDIDDetails(identifier: string, api: ApiPromise): Promise<AnyJson>;
/**
 * Get the accountId for a given DID
 * @param {string} identifier
 * @param {ApiPromise} api
 * @param {Number} blockNumber (optional)
 * @returns {JSON}
 */
declare function resolveDIDToAccount(identifier: string, api: ApiPromise, blockNumber?: number): Promise<any>;
/**
 * Get the DID associated to given accountID
 * @param {string} accountId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {JSON}
 */
declare function resolveAccountIdToDid(accountId: any, api: ApiPromise): Promise<string | Boolean>;
/**
 * This function will rotate the keys assiged to a DID
 * It should only be called by validator accounts, else will fail
 * @param {string} identifier
 * @param {Uint8Array} newKey
 * @param {string|number} syncTo
 * @param {KeyringPair} signingKeypair // of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function updateDidKey(identifier: any, newKey: any, syncTo: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Convert to hex but return fixed size always, mimics substrate storage
 * @param {string} data
 * @param {number} size
 * @return {string}
 */
declare function convertFixedSizeHex(data: string, size?: number): any;
/**
 * Checks if the given did is in hex format or not & converts it into valid hex format.
 *
 *  Note: This util function is needed since dependant module wont convert the utf did to hex anymore
 *
 * @param {string} did
 * @return {string} Hex did
 */
declare const sanitiseDid: (did: any) => any;
/**
 * Sanitize paraId before creating a did
 * @param {string|number|null} syncTo
 * @param {ApiPromise} api
 * @returns {number|null}
 */
declare const sanitiseSyncTo: (syncTo: any, api: ApiPromise) => Promise<number>;
/**
 * Check if the user is an approved validator
 * @param {string} identifier
 * @param {ApiPromise} api
 * @returns {Boolean}
 */
declare function isDidValidator(identifier: string, api: ApiPromise): Promise<boolean>;
/**
 * Fetch the history of rotated keys for the specified DID
 * @param {string} identifier
 * @param {ApiPromise} api
 * @returns {JSON}
 */
declare function getDidKeyHistory(identifier: string, api: ApiPromise): Promise<AnyJson>;
/**
 *
 * @param {string} identifier
 * @param {string} metadata
 * @param {Keyringpair} signingKeypair of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function updateMetadata(identifier: any, metadata: any, signingKeypair: any, api: ApiPromise): Promise<any>;
/**
 * Sync DID VC with other chains
 * @param {string} identifier
 * @param syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function syncDid(identifier: any, syncTo: any, signingKeypair: any, api: ApiPromise): Promise<any>;
/**
 * Remove DID VC
 * @param {string} identifier
 * @param syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair of a SUDO account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function removeDid(identifier: any, syncTo: any, signingKeypair: any, api: ApiPromise): Promise<any>;
export { convertFixedSizeHex, generateMnemonic, createPrivate, createPublic, getDIDDetails, updateDidKey, resolveDIDToAccount, getDidKeyHistory, resolveAccountIdToDid, isDidValidator, updateMetadata, sanitiseDid, sanitiseSyncTo, syncDid, removeDid };
