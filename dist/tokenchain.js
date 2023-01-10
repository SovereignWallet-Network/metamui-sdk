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
exports.getTokenInfo = exports.getTokenIssuer = exports.removeParachain = exports.initParachain = exports.lookUpParaId = exports.lookup = exports.getTokenList = void 0;
const connection_1 = require("./connection");
const helper_1 = require("./common/helper");
const utils_1 = require("./utils");
const _1 = require(".");
const token_1 = require("./token");
const vc_1 = require("./vc");
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
                name: (0, utils_1.hexToString)(tokenInfo),
            });
        }
        tokenList.push({ id: null, name: 'MUI' });
        tokenList.sort((a, b) => a.name > b.name ? 1 : -1);
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
function lookup(tokenName, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const paraId = (yield provider.query.tokenchain.lookup((0, token_1.sanitiseCCode)(tokenName))).toString();
        return parseInt(paraId, 10);
    });
}
exports.lookup = lookup;
/**
 * Reverse Lookup Tokenchain with ParaId to get Token Name
 * @param {Number} paraId
 * @param {ApiPromise} api
 * @returns {String} Token Name
 */
function lookUpParaId(paraId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return _1.utils.tidy((0, utils_1.hexToString)((yield provider.query.tokenchain.rLookup(paraId)).toString())).toUpperCase();
    });
}
exports.lookUpParaId = lookUpParaId;
/**
 * Get Token Issuer by currency code
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {String} Token Isssuer Did
 */
function getTokenIssuer(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokenchain.tokenIssuers(currencyCode)).toHex();
    });
}
exports.getTokenIssuer = getTokenIssuer;
/**
 * Get Token Info by currency code
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Object} Token Details
 */
function getTokenInfo(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let tokenInfo = (yield provider.query.tokenchain.tokenInfos((0, token_1.sanitiseCCode)(currencyCode))).toJSON();
        return {
            tokenName: (0, utils_1.hexToString)(tokenInfo.tokenName),
            reservedBalance: tokenInfo.reservedBalance,
            initialIssuance: tokenInfo.initialIssuance,
            decimal: tokenInfo.decimal
        };
    });
}
exports.getTokenInfo = getTokenInfo;
/**
 * Add new parachain (requires sudo)
 * @param {HexString} vcId Currency Code HexString
 * @param {number} initialIssuance LOWEST FORM
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 */
function initParachain(vcId, initialIssuance, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const vc_check = yield (0, vc_1.getVCs)(vcId, provider);
        if (vc_check == null)
            throw new Error('VC does not exist');
        if (initialIssuance < 1 || initialIssuance == null)
            throw new Error('Initial Issuance must be greater than 0');
        const tx = provider.tx.tokenchain.initParachain(vcId, initialIssuance);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.initParachain = initParachain;
/**
 * Remove parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 */
function removeParachain(tokenName, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.sudo.sudo(provider.tx.tokenchain.removeParachain((0, token_1.sanitiseCCode)(tokenName)));
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeParachain = removeParachain;

//# sourceMappingURL=tokenchain.js.map
