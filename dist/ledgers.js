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
exports.totalIssuance = exports.tokenIssuer = exports.tokenInfoRLookup = exports.tokenInfo = exports.tokenData = exports.tokenCurrencyCounter = exports.removedTokens = exports.locks = exports.accounts = exports.sanitiseCCode = exports.transferToken = exports.transferTokenWithMemo = exports.transferAll = exports.transfer = exports.slashToken = exports.setBalance = exports.removeToken = exports.mintToken = exports.issueToken = void 0;
const did_1 = require("./did");
const connection_1 = require("./connection");
const did_2 = require("./did");
const helper_1 = require("./common/helper");
const utils_1 = require("./utils");
// Extrinsic functions
/**
 * Issue a new currency
 * @param {HexString} vcId
 * @param {Number} totalSupply
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function issueToken(vcId, totalSupply, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.tokens.issueToken(vcId, totalSupply);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.issueToken = issueToken;
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
        const tx = provider.tx.tokens.mintToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.mintToken = mintToken;
/**
 * Remove Token from circulation
 * @param {String} currencyCode
 * @param {HexString} vcId
 * @param {String} fromDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function removeToken(currencyCode, vcId, fromDid, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let from_did_hex = (0, did_2.sanitiseDid)(fromDid);
        let from_did_check = yield (0, did_1.resolveDIDToAccount)(from_did_hex, provider);
        if (!from_did_check) {
            throw new Error('DID.DIDNotRegistered');
        }
        const tx = provider.tx.tokens.removeToken(currencyCode, vcId, from_did_hex);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeToken = removeToken;
/**
 * Set Balance of a DID of a given currency
 * @param {String} dest
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function setBalance(dest, currencyCode, amount, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_hex = (0, did_2.sanitiseDid)(dest);
        let dest_check = yield (0, did_1.resolveDIDToAccount)(dest_hex, provider);
        if (!dest_check) {
            throw new Error('DID.DIDNotRegistered');
        }
        const tx = provider.tx.tokens.setBalance(dest_hex, sanitiseCCode(currencyCode), amount);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.setBalance = setBalance;
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
        const tx = provider.tx.tokens.slashToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.slashToken = slashToken;
/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function transfer(destDid, currencyCode, amount, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_2.sanitiseDid)(destDid);
        let dest_did_check = yield (0, did_1.resolveDIDToAccount)(dest_did_hex, provider);
        if (!dest_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.tokens.transfer(dest_did_hex, sanitiseCCode(currencyCode), amount);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transfer = transfer;
/**
 * Transfer all token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function transferAll(destDid, currencyCode, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_2.sanitiseDid)(destDid);
        let dest_did_check = yield (0, did_1.resolveDIDToAccount)(dest_did_hex, provider);
        if (!dest_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.tokens.transferAll(dest_did_hex, sanitiseCCode(currencyCode));
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferAll = transferAll;
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
function transferTokenWithMemo(destDid, currencyCode, amount, memo, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_2.sanitiseDid)(destDid);
        let dest_did_check = yield (0, did_1.resolveDIDToAccount)(dest_did_hex, provider);
        if (!dest_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.tokens.transfer(dest_did_hex, sanitiseCCode(currencyCode), amount, memo);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferTokenWithMemo = transferTokenWithMemo;
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
        const tx = provider.tx.tokens.transferToken(vcId, to_did_hex);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferToken = transferToken;
/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
const sanitiseCCode = (token) => {
    if (!token)
        return null;
    if (token.startsWith('0x'))
        return token.padEnd(utils_1.CURRENCY_CODE_BYTES, '\0');
    return (0, utils_1.encodeData)(token.padEnd(utils_1.CURRENCY_CODE_BYTES, '\0'), 'currency_code');
};
exports.sanitiseCCode = sanitiseCCode;
// Storage Query Functions
/**
 * Get the token balance of an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
function accounts(currencyCode, did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.accounts(sanitiseCCode(currencyCode), (0, did_2.sanitiseDid)(did))).toJSON();
    });
}
exports.accounts = accounts;
/**
 * Get any liquidity locks of a token type under an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
function locks(currencyCode, did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.locks(sanitiseCCode(currencyCode), (0, did_2.sanitiseDid)(did))).toJSON();
    });
}
exports.locks = locks;
/**
 * Storage map between currency code and block number
 * @param {ApiPromise} api
 * @param {String} currencyCode (Optional)
 */
function removedTokens(api, currencyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.removedTokens(sanitiseCCode(currencyCode))).toJSON();
    });
}
exports.removedTokens = removedTokens;
/**
 * Token currency counter
 * @param {ApiPromise} api
 */
function tokenCurrencyCounter(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenCurrencyCounter()).toString();
    });
}
exports.tokenCurrencyCounter = tokenCurrencyCounter;
/**
 * Map to store a friendly token name for token
 * @param {String} currencyCode
 * @param {ApiPromise} api
 */
function tokenData(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenData(sanitiseCCode(currencyCode))).toJSON();
    });
}
exports.tokenData = tokenData;
/**
 * Get Token Information
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Currency Id
 */
function tokenInfo(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenInfo(sanitiseCCode(currencyCode))).toString();
    });
}
exports.tokenInfo = tokenInfo;
/**
 * Reverse lookup Token Information
 * @param {Number} currencyId
 * @param {ApiPromise} api
 * @returns {HexString} Currency Code Hex
 */
function tokenInfoRLookup(currencyId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenInfoRLookup(currencyId)).toHex();
    });
}
exports.tokenInfoRLookup = tokenInfoRLookup;
/**
 * Lookup Token Issuer
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {HexString} Token Owner DID Hex
 */
function tokenIssuer(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenIssuer(sanitiseCCode(currencyCode))).toHex();
    });
}
exports.tokenIssuer = tokenIssuer;
/**
 * Get Total Token Issuance
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Token Issuance
 */
function totalIssuance(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.totalIssuance(sanitiseCCode(currencyCode))).toString();
    });
}
exports.totalIssuance = totalIssuance;

//# sourceMappingURL=ledgers.js.map
