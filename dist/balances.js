"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferWithMemo = exports.transfer = exports.getTotalSupply = exports.subscribeToDetailedBalanceChanges = exports.subscribeToBalanceChanges = exports.getDetailedBalance = exports.getBalance = void 0;
const connection_1 = require("./connection");
const did_1 = require("./did");
const helper_1 = require("./common/helper");
/** Get account balance(Highest Form) based on the did supplied.
* @param {string} did valid registered did
* @param {ApiPromise} api (optional)
* @returns {Number}
*/
const getBalance = (did, api) => __awaiter(void 0, void 0, void 0, function* () {
    // Resolve the did to get account ID
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const provider = api || (yield (0, connection_1.buildConnection)('local'));
            const did_hex = (0, did_1.sanitiseDid)(did);
            const token = yield provider.rpc.system.properties();
            const tokenData = token.toHuman();
            let decimals = tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0];
            // console.log('Decimals', decimals);
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
exports.getBalance = getBalance;
/** Get account balance(Lowest Form) based on the did supplied.
 * A valid registered did is required
* @param {string} did valid registered did
* @param {ApiPromise} api (optional)
* @returns {Object}
*/
const getDetailedBalance = (did, api) => __awaiter(void 0, void 0, void 0, function* () {
    // Resolve the did to get account ID
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const provider = api || (yield (0, connection_1.buildConnection)('local'));
            const did_hex = (0, did_1.sanitiseDid)(did);
            const accountInfo = yield provider.query.token.account(did_hex);
            resolve((_b = accountInfo.toJSON()) === null || _b === void 0 ? void 0 : _b['data']);
        }
        catch (err) {
            // console.log(err);
            return reject(new Error("Cannot get balance"));
        }
    }));
});
exports.getDetailedBalance = getDetailedBalance;
/** Listen to balance changes for a DID and execute the callback.
* @param {string} did
* @param {Function} callback
* @param {ApiPromise} api
*/
const subscribeToBalanceChanges = (did, callback, api) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = (0, did_1.sanitiseDid)(did);
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
exports.subscribeToBalanceChanges = subscribeToBalanceChanges;
/**
 * Subsribe to detailed balance changes for a DID and execute the callback.
 * @param {string} did
 * @param {Function} callback
 * @param {ApiPromise} api
 */
const subscribeToDetailedBalanceChanges = (did, callback, api) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = (0, did_1.sanitiseDid)(did);
        return yield provider.query.token.account(did_hex, ({ data }) => {
            callback(data.toJSON());
        });
    }
    catch (err) {
        return null;
    }
});
exports.subscribeToDetailedBalanceChanges = subscribeToDetailedBalanceChanges;
/**
 * Get total units of tokens issued in the network.
 * @param {ApiPromise} api
 * @param {Boolean} decimal default value is false. Value is true for decimal form (Highest form) and false for lowest form
 */
function getTotalSupply(api, decimal) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let totalIssuance = Number(yield provider.query.balances.totalIssuance());
        if (decimal) {
            const token = yield provider.rpc.system.properties();
            const tokenData = token.toHuman();
            let decimals = tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0];
            totalIssuance = totalIssuance / Math.pow(10, decimals);
        }
        return totalIssuance;
    });
}
exports.getTotalSupply = getTotalSupply;
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
function transfer(senderAccountKeyPair, receiverDID, amount, api, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        // check if the recipent DID is valid
        const receiverAccountID = yield (0, did_1.resolveDIDToAccount)(receiverDID, provider);
        // console.log("Receiver Account ID", receiverAccountID);
        if (!receiverAccountID) {
            throw new Error('balances.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.balances.transfer({ Id: receiverAccountID }, amount);
        if (nonce === undefined) {
            nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        }
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transfer = transfer;
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
function transferWithMemo(senderAccountKeyPair, receiverDID, amount, memo, api, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        // check if the recipent DID is valid
        const receiverAccountID = yield (0, did_1.resolveDIDToAccount)(receiverDID, provider);
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
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferWithMemo = transferWithMemo;
