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
exports.getTokenList = exports.withdrawReserved = exports.transferToken = exports.slashToken = exports.mintToken = void 0;
const did_1 = require("./did");
const connection_1 = require("./connection");
const did_2 = require("./did");
const helper_1 = require("./common/helper");
const util_1 = require("@polkadot/util");
/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function mintToken(vcId, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.token.mintToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.mintToken = mintToken;
/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function slashToken(vcId, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.token.slashToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.slashToken = slashToken;
/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {string} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
*/
function transferToken(vcId, toDid, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        let to_did_hex = (0, did_2.sanitiseDid)(toDid);
        let to_did_check = yield (0, did_1.resolveDIDToAccount)(to_did_hex, api);
        if (!to_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.token.transferToken(vcId, to_did_hex);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferToken = transferToken;
/**
 * Withdraw Reserved tokens from one DID to another DID
 * @param {string} toDid
 * @param {string} fromDid
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function withdrawReserved(toDid, fromDid, amount, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        let [to_account_id, from_account_id] = yield Promise.all([
            (0, did_1.resolveDIDToAccount)((0, did_2.sanitiseDid)(toDid), api),
            (0, did_1.resolveDIDToAccount)((0, did_2.sanitiseDid)(fromDid), api)
        ]);
        if (!to_account_id) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        if (!from_account_id) {
            throw new Error('DID.SenderDIDNotRegistered');
        }
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.token.withdrawReserved((0, did_2.sanitiseDid)(toDid), (0, did_2.sanitiseDid)(fromDid), amount);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.withdrawReserved = withdrawReserved;
/**
 * get Token List
 * @param {ApiPromise} api
 * @returns {Object} Token List
 */
function getTokenList(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const paraIds = (yield provider.query.paras.parachains());
        let tokenList = [];
        for (let i = 0; i < paraIds.length; i++) {
            let tokenInfo = String(yield provider.query.tokenchain.rLookup(paraIds[i]));
            tokenList.push({
                id: paraIds[i].toString(),
                name: (0, util_1.hexToString)(tokenInfo).trim().split('\x00')[0],
            });
        }
        return tokenList;
    });
}
exports.getTokenList = getTokenList;
