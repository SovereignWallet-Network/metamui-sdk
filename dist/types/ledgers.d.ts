import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/**
 * Issue a new currency
 * @param {HexString} vcId
 * @param {Number} totalSupply
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function issueToken(vcId: any, totalSupply: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function mintToken(vcId: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Remove Token from circulation
 * @param {String} currencyCode
 * @param {HexString} vcId
 * @param {String} fromDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function removeToken(currencyCode: any, vcId: any, fromDid: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Set Balance of a DID of a given currency
 * @param {String} dest
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function setBalance(dest: any, currencyCode: any, amount: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function slashToken(vcId: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function transfer(destDid: any, currencyCode: any, amount: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Transfer all token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function transferAll(destDid: any, currencyCode: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {String} memo
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function transferTokenWithMemo(destDid: any, currencyCode: any, amount: any, memo: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {string} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function transferToken(vcId: any, toDid: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
declare const sanitiseCCode: (token: any) => any;
/**
 * Get the token balance of an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
declare function accounts(currencyCode: String, did: String, api: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get any liquidity locks of a token type under an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
declare function locks(currencyCode: String, did: String, api: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Storage map between currency code and block number
 * @param {ApiPromise} api
 * @param {String} currencyCode (Optional)
 */
declare function removedTokens(api: ApiPromise, currencyCode?: String): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Token currency counter
 * @param {ApiPromise} api
 */
declare function tokenCurrencyCounter(api: ApiPromise): Promise<string>;
/**
 * Map to store a friendly token name for token
 * @param {String} currencyCode
 * @param {ApiPromise} api
 */
declare function tokenData(currencyCode: String, api: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get Token Information
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Currency Id
 */
declare function tokenInfo(currencyCode: String, api: ApiPromise): Promise<string>;
/**
 * Reverse lookup Token Information
 * @param {Number} currencyId
 * @param {ApiPromise} api
 * @returns {HexString} Currency Code Hex
 */
declare function tokenInfoRLookup(currencyId: Number, api: ApiPromise): Promise<`0x${string}`>;
/**
 * Lookup Token Issuer
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {HexString} Token Owner DID Hex
 */
declare function tokenIssuer(currencyCode: String, api: ApiPromise): Promise<`0x${string}`>;
/**
 * Get Total Token Issuance
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Token Issuance
 */
declare function totalIssuance(currencyCode: String, api: ApiPromise): Promise<string>;
export { issueToken, mintToken, removeToken, setBalance, slashToken, transfer, transferAll, transferTokenWithMemo, transferToken, sanitiseCCode, accounts, locks, removedTokens, tokenCurrencyCounter, tokenData, tokenInfo, tokenInfoRLookup, tokenIssuer, totalIssuance };
