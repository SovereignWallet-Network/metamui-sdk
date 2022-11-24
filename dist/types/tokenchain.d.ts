import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
declare const sanitiseToken: (token: String) => String;
/**
 * get Token List
 * @param {ApiPromise} api
 * @returns {Object} Token List
 */
declare function getTokenList(api: ApiPromise): Promise<any[]>;
/**
 * Lookup Tokenchain with Token Name to get ParaId
 * @param {HexString|String} tokenName
 * @param {ApiPromise} api
 * @returns {Number} Para Id
 */
declare function lookupTokenchain(tokenName: HexString | String, api: ApiPromise): Promise<number>;
/**
 * Reverse Lookup Tokenchain with ParaId to get Token Name
 * @param {Number} paraId
 * @param {ApiPromise} api
 * @returns {String} Token Name
 */
declare function reverseLookupTokenchain(paraId: Number, api: ApiPromise): Promise<string>;
/**
 * Add new parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {Number} paraId
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
declare function addParachain(tokenName: String, paraId: Number, sudoAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Remove parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
declare function removeParachain(tokenName: String, sudoAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
export { sanitiseToken, getTokenList, lookupTokenchain, reverseLookupTokenchain, addParachain, removeParachain };
