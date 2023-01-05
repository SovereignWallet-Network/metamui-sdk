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
exports.getBlacklistingReasonCode = exports.getBlacklistingReasonFromCode = exports.getBlacklistingReasonOfDid = exports.getBlacklistedDids = exports.sanitiseInput = exports.removeBlacklistingReason = exports.addBlacklistingReason = exports.removeBlacklistedDid = exports.addBlacklistedDid = exports.removeAllowedExtrinsic = exports.addAllowedExtrinsic = void 0;
const connection_1 = require("./connection");
const did_1 = require("./did");
const helper_1 = require("./common/helper");
const _1 = require(".");
/**
 * Add Allowed Extrinsics
 * @param {string} palletName
 * @param {string} functionName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
function addAllowedExtrinsic(palletName, functionName, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.checkAccess.addAllowedExtrinsic(sanitiseInput(palletName), sanitiseInput(functionName));
        const nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.addAllowedExtrinsic = addAllowedExtrinsic;
/**
 * Remove Allowed Extrinsics
 * @param {string} palletName
 * @param {string} functionName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
function removeAllowedExtrinsic(palletName, functionName, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.checkAccess.removeAllowedExtrinsic(sanitiseInput(palletName), sanitiseInput(functionName));
        const nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeAllowedExtrinsic = removeAllowedExtrinsic;
/**
 * Add Blacklisted Did
 * @param {string} did
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @param {number} reasonCode OPTIONAL
 * @returns {Promise<any>} Transaction object
 */
function addBlacklistedDid(did, senderAccountKeyPair, api, reasonCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let tx;
        if (!reasonCode)
            tx = provider.tx.checkAccess.addBlacklistedDid((0, did_1.sanitiseDid)(did));
        else
            tx = provider.tx.checkAccess.addBlacklistedDid((0, did_1.sanitiseDid)(did), reasonCode);
        const nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.addBlacklistedDid = addBlacklistedDid;
/**
 * Add Blacklisted Did
 * @param {string} did
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
function removeBlacklistedDid(did, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let tx = provider.tx.checkAccess.removeBlacklistedDid((0, did_1.sanitiseDid)(did));
        const nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeBlacklistedDid = removeBlacklistedDid;
/**
 * Add Blacklisting Reason
 * @param {string} reasonName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
function addBlacklistingReason(reasonName, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let tx = provider.tx.checkAccess.addBlacklistingReason(sanitiseInput(reasonName));
        const nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.addBlacklistingReason = addBlacklistingReason;
/**
 * Remove Blacklisting Reason
 * @param {number} reasonCode
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
function removeBlacklistingReason(reasonCode, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let tx = provider.tx.checkAccess.removeBlacklistingReason(reasonCode);
        const nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        const signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeBlacklistingReason = removeBlacklistingReason;
/**
 * Sanitise input
 * @param {string} input
 * @return {string} Hex data
 */
const sanitiseInput = (input) => {
    if (input.startsWith('0x'))
        return input.padEnd(32, '\0');
    return _1.utils.encodeData(input.padEnd(32, '\0'), 'Input32Bytes');
};
exports.sanitiseInput = sanitiseInput;
/**
 * Get all blacklisted dids with reasons
 * @param {ApiPromise} api
 */
function getBlacklistedDids(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const blacklistedDids = yield provider.query.checkAccess.blacklistedDids.entries();
        if (!blacklistedDids)
            return null;
        return blacklistedDids.map((did) => {
            return {
                did: did[0].toHuman(),
                reason: did[1].toHuman()
            };
        });
    });
}
exports.getBlacklistedDids = getBlacklistedDids;
/**
 * Get reason for blacklisted did
 * @param {string} did
 * @param {ApiPromise} api
 */
function getBlacklistingReasonOfDid(did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const reason = yield provider.query.checkAccess.blacklistedDids((0, did_1.sanitiseDid)(did));
        if (!reason)
            return null;
        return reason.toJSON();
    });
}
exports.getBlacklistingReasonOfDid = getBlacklistingReasonOfDid;
/**
 * Get blacklisting reson from reason code
 * @param {number} reasonCode
 * @param {ApiPromise} api
 * @returns Blacklisting reason
 */
function getBlacklistingReasonFromCode(reasonCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const reason = yield provider.query.checkAccess.blacklistingReasons(reasonCode);
        if (!reason)
            return null;
        return reason.toJSON();
    });
}
exports.getBlacklistingReasonFromCode = getBlacklistingReasonFromCode;
/**
 * Reverse lookup for blacklisting reason code
 * @param {string} reasonName
 * @param {ApiPromise} api
 * @returns Blacklisting reason code
 */
function getBlacklistingReasonCode(reasonName, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const reasonCode = yield provider.query.checkAccess.blacklistingReasonsRLookup(sanitiseInput(reasonName));
        if (!reasonCode)
            return null;
        return reasonCode.toJSON();
    });
}
exports.getBlacklistingReasonCode = getBlacklistingReasonCode;

//# sourceMappingURL=checkAccess.js.map
