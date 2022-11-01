var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { buildConnection } from './connection';
import { resolveDIDToAccount, sanitiseDid } from './did';
import { submitTransaction } from './common/helper';
/** Get account balance(Highest Form) based on the did supplied.
* @param {String} did
* @param {APIPromise} api (optional)
*/
const getBalance = (did, api) => __awaiter(void 0, void 0, void 0, function* () {
    // Resolve the did to get account ID
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const provider = api || (yield buildConnection('local'));
            const did_hex = sanitiseDid(did);
            const token = yield provider.rpc.system.properties();
            const tokenData = token.toHuman();
            let decimals = tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0];
            console.log('Decimals', decimals);
            const accountInfo = yield provider.query.token.account(did_hex);
            const data = (_a = accountInfo.toJSON()) === null || _a === void 0 ? void 0 : _a['data'];
            resolve(data.free / Math.pow(10, decimals));
        }
        catch (err) {
            // console.log(err);
            return reject(new Error("Cannot get balance"));
        }
    }));
});
/** Listen to balance changes for a DID and execute the callback.
* @param {String} identifier
* @param {Function} callback
* @param {APIPromise} api
*/
const subscribeToBalanceChanges = (identifier, callback, api) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = api || (yield buildConnection('local'));
        const did_hex = sanitiseDid(identifier);
        const token = yield provider.rpc.system.properties();
        const tokenData = token.toHuman();
        let decimals = tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0];
        return yield provider.query.token.account(did_hex, ({ data: { free: currentBalance } }) => {
            callback(currentBalance.toNumber() / Math.pow(10, decimals));
        });
    }
    catch (err) {
        return null;
    }
});
/**
 * The function will perform a metamui transfer operation from the account of senderAccount to the
 * receiverDID.
 * Note : balanceCheck has not been included in the checks since sender not having balance
 * is handled in extrinsic, check test/balances.js
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {Number} amount In Lowest Form
 * @param {APIPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
function transfer(senderAccountKeyPair, receiverDID, amount, api, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        // check if the recipent DID is valid
        const receiverAccountID = yield resolveDIDToAccount(receiverDID, provider);
        // console.log("Receiver Account ID", receiverAccountID);
        if (!receiverAccountID) {
            throw new Error('balances.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.balances.transfer({ Id: receiverAccountID }, amount);
        if (nonce === undefined) {
            nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        }
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.
 *
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {Number} amount In Lowest Form
 * @param {String} memo
 * @param {APIPromise} api
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
function transferWithMemo(senderAccountKeyPair, receiverDID, amount, memo, api, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        // check if the recipent DID is valid
        const receiverAccountID = yield resolveDIDToAccount(receiverDID, provider);
        // console.log("Receiver Account ID", receiverAccountID);
        if (!receiverAccountID) {
            throw (new Error('balances.RecipentDIDNotRegistered'));
        }
        const tx = provider.tx.balances
            .transferWithMemo({ id: receiverAccountID }, amount, memo);
        if (nonce === undefined) {
            nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        }
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
export { getBalance, subscribeToBalanceChanges, transfer, transferWithMemo };
