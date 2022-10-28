import { ApiPromise } from '@polkadot/api';
import { AnyJson } from '@polkadot/types/types';
import { KeyringPair } from '@polkadot/keyring/types';
/** Generate Mnemonic
 * @returns {String} Mnemonic
 */
declare const generateMnemonic: () => string;
/**
 * Store the generated DID VC
 * @param vcId
 * @param paraId Optional - Stores in current chain if paraId not provided
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {String} txnId Txnid for storage operation.
 */
declare function createPrivate(vcId: any, paraId: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Create Private DID and store the generated DID object in blockchain
 * @param vcId
 * @param paraId Optional - Stores in current chain if paraId not provided
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {String} txnId Txnid for storage operation.
 */
declare function createPublic(vcId: any, paraId: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Get did information from accountID
 * @param {String} identifier DID Identifier
 * @returns {JSON}
 */
declare function getDIDDetails(identifier: string, api?: ApiPromise): Promise<AnyJson>;
/**
 * Get the accountId for a given DID
 * @param {String} identifier
 * @param {ApiPromise} api
 * @param {Number} blockNumber (optional)
 * @returns {String}
 */
declare function resolveDIDToAccount(identifier: string, api: ApiPromise, blockNumber?: number): Promise<any>;
/**
 * Get the DID associated to given accountID
 * @param {String} accountId (hex/base64 version works)
 * @param {ApiPromise} api
 */
declare function resolveAccountIdToDid(accountId: any, api?: ApiPromise): Promise<string | boolean>;
/**
 * This function will rotate the keys assiged to a DID
 * It should only be called by validator accounts, else will fail
 * @param {String} identifier
 * @param {Uint8Array} newKey
 * @param {KeyringPair} paraId
 * @param {KeyringObj} signingKeypair // of a validator account
 * @param {ApiPromise} api
 */
declare function updateDidKey(identifier: any, newKey: any, paraId: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Checks if the given did is in hex format or not & converts it into valid hex format.
 *
 *  Note: This util function is needed since dependant module wont convert the utf did to hex anymore
 *
 * @param {String} did
 * @return {String} Hex did
 */
declare const sanitiseDid: (did: any) => any;
/**
 * Check if the user is an approved validator
 * @param {String} identifier
 * @param {ApiPromise} api
 */
declare function isDidValidator(identifier: any, api?: ApiPromise): Promise<boolean>;
/**
 * Fetch the history of rotated keys for the specified DID
 * @param {String} identifier
 * @param {ApiPromise} api
 * @returns {Array}
 */
declare function getDidKeyHistory(identifier: any, api?: ApiPromise | false): Promise<AnyJson>;
/**
 *
 * @param {String} identifier
 * @param {String} metadata
 * @param {KeyringObj} signingKeypair of a validator account
 * @param {ApiPromise} api
 */
declare function updateMetadata(identifier: any, metadata: any, signingKeypair: any, api: ApiPromise): Promise<any>;
/**
 * Sync DID VC with other chains
 * @param {String} identifier
 * @param {String} paraId Optional
 * @param {KeyringObj} signingKeypair of a validator account
 * @param {ApiPromise} api
 */
declare function syncDid(identifier: any, paraId: any, signingKeypair: any, api: ApiPromise): Promise<any>;
/**
 * Remove DID VC
 * @param {String} identifier
 * @param {String} paraId Optional
 * @param {KeyringObj} signingKeypair of a SUDO account
 * @param {ApiPromise} api
 */
declare function removeDid(identifier: any, paraId: any, signingKeypair: any, api: ApiPromise): Promise<any>;
export { generateMnemonic, createPrivate, createPublic, getDIDDetails, updateDidKey, resolveDIDToAccount, getDidKeyHistory, resolveAccountIdToDid, isDidValidator, updateMetadata, sanitiseDid, syncDid, removeDid };
