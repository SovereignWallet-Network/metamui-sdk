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
exports.reverseLookup = exports.lookup = exports.getPublicKey = exports.getDidType = void 0;
const util_1 = require("@polkadot/util");
const connection_1 = require("./connection");
const did_1 = require("./did");
/**
 * Get Did Type from Mapping
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} Did Type
 */
function getDidType(did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.cacheDid.didTypeMap((0, did_1.sanitiseDid)(did))).toString();
    });
}
exports.getDidType = getDidType;
/**
 * Get mapped public key from Did
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} Public Key Hex
 */
function getPublicKey(did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.cacheDid.publicKeyMap((0, did_1.sanitiseDid)(did))).toString();
    });
}
exports.getPublicKey = getPublicKey;
/**
 * Lookup Cached Did
 * @param {String} did
 * @param {ApiPromise} api
 * @returns {String} AccountId
 */
function lookup(did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.cacheDid.lookup((0, did_1.sanitiseDid)(did))).toString();
    });
}
exports.lookup = lookup;
/**
 * Reverse Lookup Cached Did
 * @param {String} accountId
 * @param {ApiPromise} api
 * @returns {String} Did
 */
function reverseLookup(accountId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (0, util_1.hexToString)((yield provider.query.cacheDid.rLookup(accountId)).toString());
    });
}
exports.reverseLookup = reverseLookup;

//# sourceMappingURL=cacheDid.js.map
