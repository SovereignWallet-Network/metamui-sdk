import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
declare function mintToken(vcId: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {HexString}
 */
declare function slashToken(vcId: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {String} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
*/
declare function transferToken(vcId: any, toDid: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Withdraw Reserved tokens from one DID to another DID
 * @param {String} toDid
 * @param {String} fromDid
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
declare function withdrawReserved(toDid: any, fromDid: any, amount: any, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
export { mintToken, slashToken, transferToken, withdrawReserved };
