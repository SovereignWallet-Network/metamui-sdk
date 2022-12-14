import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/**
 * Issue a new currency
 * @param {HexString} vcId
 * @param {Number} totalSupply HIGHEST FORM WITHOUT DECIMALS
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
/** Get account balance (Highest Form) based on the did supplied.
* @param {string} did valid registered did
* @param {string} currencyCode
* @param {ApiPromise} api (optional)
* @returns {number}
*/
declare const getBalance: (did: string, currencyCode: string, api: ApiPromise) => Promise<number>;
/** Get account balance (Lowest Form) based on the did supplied.
 * A valid registered did is required
 * @param {string} currencyCode
 * @param {ApiPromise} api (optional)
 * @returns {Object} Balance Object { free: number, reserved: number, frozen: number}
 */
declare const getDetailedBalance: (did: string, currencyCode: string, api: ApiPromise) => Promise<unknown>;
/** Listen to balance (Highest Form) changes for a DID and execute the callback
* @param {string} did
* @param {string} currencyCode
* @param {Function} callback
* @param {ApiPromise} api
*/
declare const subscribeToBalanceChanges: (did: string, currencyCode: string, callback: (balance: number) => void, api: ApiPromise) => Promise<import("@polkadot/types-codec/types").Codec>;
/**
 * Subsribe to detailed balance changes for a DID and execute the callback.
 * @param {string} did
 * @param {string} currencyCode
 * @param {Function} callback
 * @param {ApiPromise} api
 */
declare const subscribeToDetailedBalanceChanges: (did: string, currencyCode: string, callback: (data: Object) => void, api: ApiPromise) => Promise<import("@polkadot/types-codec/types").Codec>;
/**
 * get Token List
 * @param {ApiPromise} api
 * @returns {Object} Token List
 */
declare function getTokenList(api: ApiPromise): Promise<any>;
/**
 * Get any liquidity locks of a token type under an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
declare function getLocks(currencyCode: String, did: String, api: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
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
 * @param {string | null} currencyCode
 * @param {ApiPromise} api
 */
declare function tokenData(currencyCode: string | null, api: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
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
export { issueToken, mintToken, removeToken, getBalance, setBalance, getDetailedBalance, subscribeToBalanceChanges, subscribeToDetailedBalanceChanges, slashToken, transfer, transferAll, transferTokenWithMemo, transferToken, sanitiseCCode, getLocks, removedTokens, tokenCurrencyCounter, getTokenList, tokenData, tokenInfo, tokenInfoRLookup, tokenIssuer, totalIssuance };
