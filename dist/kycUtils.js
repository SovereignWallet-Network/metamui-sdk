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
exports.verifySsidVC = exports.signSsidVC = exports.createSsidVC = exports.verifyVC = exports.signVC = exports.createVC = void 0;
const util_1 = require("@polkadot/util");
const util_crypto_1 = require("@polkadot/util-crypto");
const js_sha256_1 = require("js-sha256");
const did_1 = require("./did");
/**
 *
 * @param propertiesJson
 * @returns {Object} Create Unsigned VC
 */
function createVC(propertiesJson) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            properties: propertiesJson,
            hash: (0, util_1.stringToHex)((0, js_sha256_1.sha256)(JSON.stringify(propertiesJson))),
            verifier: undefined,
            signature: undefined,
        };
    });
}
exports.createVC = createVC;
/**
 * @param {JSON} vcJson
 * @param {string} verifierDid
 * @param {string} signingKeyPair
 * @returns {Object} Signed VC
 */
function signVC(vcJson, verifierDid, signingKeyPair) {
    return __awaiter(this, void 0, void 0, function* () {
        const expectedHash = (0, util_1.stringToHex)((0, js_sha256_1.sha256)(JSON.stringify(vcJson.properties)));
        if (expectedHash !== vcJson.hash) {
            throw new Error("Data mismatch");
        }
        const dataToSign = (0, util_1.hexToU8a)(vcJson.hash);
        const signedData = signingKeyPair.sign(dataToSign);
        const resVC = vcJson;
        resVC.verifier = verifierDid;
        resVC.signature = (0, util_1.u8aToHex)(signedData);
        return resVC;
    });
}
exports.signVC = signVC;
/**
 *
 * @param vcJson
 * @param api
 * @returns {boolean} true or false
 */
function verifyVC(vcJson, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api;
        if (!vcJson.verifier || !vcJson.signature) {
            throw new Error("VC Not signed!");
        }
        const expectedHash = (0, util_1.stringToHex)((0, js_sha256_1.sha256)(JSON.stringify(vcJson.properties)));
        if (expectedHash !== vcJson.hash) {
            throw new Error("Data mismatch");
        }
        const isSignerValidator = yield (0, did_1.isDidValidator)(vcJson.verifier, provider);
        if (!isSignerValidator) {
            throw new Error("VC Not signed by a validator!");
        }
        const didDetails = yield (0, did_1.getDIDDetails)(vcJson.verifier, provider);
        let signerAddress = didDetails.public_key;
        if (didDetails.added_block > parseInt(vcJson.properties.issued_block, 10)) {
            console.log('Signing key has been rotated, searching for previous key history');
            const prevKeyDetails = yield (0, did_1.getDidKeyHistory)(vcJson.verifier, provider);
            prevKeyDetails.forEach(([accountId, blockNo]) => {
                if (parseInt(vcJson.properties.issued_block, 10) > blockNo) {
                    console.log('Signing Key Found!');
                    signerAddress = accountId;
                }
            });
        }
        return (0, util_crypto_1.signatureVerify)((0, util_1.hexToU8a)(vcJson.hash), (0, util_1.hexToU8a)(vcJson.signature), signerAddress.toString()).isValid;
    });
}
exports.verifyVC = verifyVC;
/**
 * @param propertiesJson
 * @returns {Object} Create Unsigned VC
 */
function createSsidVC(propertiesJson) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            properties: propertiesJson,
            hash: (0, util_1.stringToHex)((0, js_sha256_1.sha256)(JSON.stringify(propertiesJson))),
            signature: undefined,
        };
    });
}
exports.createSsidVC = createSsidVC;
/**
 * @param vcJson
 * @param signingKeyPair
 * @returns {Object} Signed VC
 */
function signSsidVC(vcJson, signingKeyPair) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataToSign = (0, util_1.hexToU8a)(vcJson.hash);
        const signedData = signingKeyPair.sign(dataToSign);
        const resVC = vcJson;
        resVC.signature = (0, util_1.u8aToHex)(signedData);
        return resVC;
    });
}
exports.signSsidVC = signSsidVC;
/**
 * @param vcJson
 * @returns {boolean} true or false
 */
function verifySsidVC(vcJson) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, util_crypto_1.signatureVerify)((0, util_1.hexToU8a)(vcJson.hash), (0, util_1.hexToU8a)(vcJson.signature), vcJson.properties.public_key.toString()).isValid;
    });
}
exports.verifySsidVC = verifySsidVC;
