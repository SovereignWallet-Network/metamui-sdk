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
exports.removeParachain = exports.addParachain = exports.reverseLookupTokenchain = exports.lookupTokenchain = exports.getTokenList = exports.sanitiseToken = void 0;
const connection_1 = require("./connection");
const helper_1 = require("./common/helper");
const util_1 = require("@polkadot/util");
global.Buffer = require('buffer').Buffer;
/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
const sanitiseToken = (token) => {
    if (token.startsWith('0x'))
        return token.padEnd(16, '0');
    return '0x' + Buffer.from(token, 'utf8').toString('hex').padEnd(16, '0');
};
exports.sanitiseToken = sanitiseToken;
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
/**
 * Lookup Tokenchain with Token Name to get ParaId
 * @param {HexString|String} tokenName
 * @param {ApiPromise} api
 * @returns {Number} Para Id
 */
function lookupTokenchain(tokenName, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const paraId = (yield provider.query.tokenchain.lookup(sanitiseToken(tokenName))).toString();
        return parseInt(paraId, 10);
    });
}
exports.lookupTokenchain = lookupTokenchain;
/**
 * Reverse Lookup Tokenchain with ParaId to get Token Name
 * @param {Number} paraId
 * @param {ApiPromise} api
 * @returns {String} Token Name
 */
function reverseLookupTokenchain(paraId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (0, util_1.hexToString)((yield provider.query.tokenchain.rLookup(paraId)).toString()).trim().split('\x00')[0];
    });
}
exports.reverseLookupTokenchain = reverseLookupTokenchain;
/**
 * Add new parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {Number} paraId
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
function addParachain(tokenName, paraId, sudoAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.sudo.sudo(provider.tx.tokenchain.addParachain(paraId, sanitiseToken(tokenName)));
        let nonce = yield provider.rpc.system.accountNextIndex(sudoAccountKeyPair.address);
        let signedTx = yield tx.signAsync(sudoAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.addParachain = addParachain;
/**
 * Remove parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
function removeParachain(tokenName, sudoAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.sudo.sudo(provider.tx.tokenchain.removeParachain(sanitiseToken(tokenName)));
        let nonce = yield provider.rpc.system.accountNextIndex(sudoAccountKeyPair.address);
        let signedTx = yield tx.signAsync(sudoAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeParachain = removeParachain;
