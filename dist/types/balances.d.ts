import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/** Get account balance(Highest Form) based on the did supplied.
* @param {string} did valid registered did
* @param {ApiPromise} api (optional)
* @returns {Number}
*/
declare const getBalance: (did: string, api: ApiPromise) => Promise<number>;
/** Get account balance(Lowest Form) based on the did supplied.
 * A valid registered did is required
* @param {string} did valid registered did
* @param {ApiPromise} api (optional)
* @returns {Object}
*/
declare const getDetailedBalance: (did: string, api: ApiPromise) => Promise<Object>;
/** Listen to balance changes for a DID and execute the callback.
* @param {string} did
* @param {Function} callback
* @param {ApiPromise} api
*/
declare const subscribeToBalanceChanges: (did: string, callback: (balance: number) => void, api: ApiPromise) => Promise<import("@polkadot/types-codec/types").Codec>;
/**
 * Subsribe to detailed balance changes for a DID and execute the callback.
 * @param {string} did
 * @param {Function} callback
 * @param {ApiPromise} api
 */
declare const subscribeToDetailedBalanceChanges: (did: string, callback: (data: Object) => void, api: ApiPromise) => Promise<import("@polkadot/types-codec/types").Codec>;
/**
 * Get total units of tokens issued in the network.
 * @param {ApiPromise} api
 * @param {Boolean} decimal default value is false. Value is true for decimal form (Highest form) and false for lowest form
 */
declare function getTotalSupply(api: ApiPromise, decimal?: Boolean): Promise<Number>;
/**
 * The function will perform a metamui transfer operation from the account of senderAccount to the
 * receiverDID. The amount is in the lowest form.
 * @param {KeyPair} senderAccountKeyPair
 * @param {string} receiverDID
 * @param {Number} amount In Lowest Form
 * @param {ApiPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
declare function transfer(senderAccountKeyPair: KeyringPair, receiverDID: string, amount: number, api: ApiPromise, nonce?: any): Promise<string>;
/**
 * This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.
 *
 * @param {KeyPair} senderAccountKeyPair
 * @param {string} receiverDID
 * @param {Number} amount In Lowest Form
 * @param {string} memo
 * @param {ApiPromise} api
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
declare function transferWithMemo(senderAccountKeyPair: KeyringPair, receiverDID: string, amount: number, memo: string, api: ApiPromise, nonce?: any): Promise<string>;
export { getBalance, getDetailedBalance, subscribeToBalanceChanges, subscribeToDetailedBalanceChanges, getTotalSupply, transfer, transferWithMemo };
