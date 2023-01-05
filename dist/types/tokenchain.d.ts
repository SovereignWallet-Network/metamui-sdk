import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
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
declare function lookup(tokenName: HexString | String, api: ApiPromise): Promise<number>;
/**
 * Reverse Lookup Tokenchain with ParaId to get Token Name
 * @param {Number} paraId
 * @param {ApiPromise} api
 * @returns {String} Token Name
 */
declare function lookUpParaId(paraId: Number, api: ApiPromise): Promise<string>;
/**
 * Get Token Issuer by currency code
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {String} Token Isssuer Did
 */
declare function getTokenIssuer(currencyCode: String, api: ApiPromise): Promise<string>;
/**
 * Get Token Info by currency code
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Object} Token Details
 */
declare function getTokenInfo(currencyCode: String, api: ApiPromise): Promise<any>;
/**
 * Add new parachain (requires sudo)
 * @param {HexString} vcId Currency Code HexString
 * @param {number} initialIssuance LOWEST FORM
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
declare function initParachain(vcId: HexString, initialIssuance: number, sudoAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Remove parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
declare function removeParachain(tokenName: String, sudoAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
export { getTokenList, lookup, lookUpParaId, initParachain, removeParachain, getTokenIssuer, getTokenInfo, };
