import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/** Get account balance(Highest Form) based on the did supplied.
* @param {String} did
*/
declare const getBalance: (did: string, api?: ApiPromise) => Promise<number>;
/** Listen to balance changes for a DID and execute the callback.
* @param {String} identifier
*/
declare const subscribeToBalanceChanges: (identifier: string, callback: (balance: number) => void, api: ApiPromise) => Promise<import("@polkadot/types-codec/types").Codec>;
/**
 * The function will perform a metamui transfer operation from the account of senderAccount to the
 * receiverDID.
 * Note : balanceCheck has not been included in the checks since sender not having balance
 * is handled in extrinsic, check test/balances.js
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {String} amount In Lowest Form
 * @param {APIPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
declare function transfer(senderAccountKeyPair: KeyringPair, receiverDID: string, amount: number, api: ApiPromise, nonce?: any): Promise<string>;
/**
 * This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.
 *
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {String} amount In Lowest Form
 * @param {String} memo
 * @param {APIPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
declare function transferWithMemo(senderAccountKeyPair: KeyringPair, receiverDID: string, amount: number, memo: string, api: ApiPromise, nonce?: any): Promise<string>;
export { getBalance, subscribeToBalanceChanges, transfer, transferWithMemo };
