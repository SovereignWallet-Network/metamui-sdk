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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedTokenAmount = exports.getVCProperty = exports.decodeVC = exports.updateStatus = exports.storeVC = exports.approveVC = exports.verifyGenericVC = exports.generateVC = exports.getGenericVCData = exports.getVCHistoryByVCId = exports.getVCApprovers = exports.getVCs = exports.getDIDByVCId = exports.getVCIdsByDID = exports.createPrivateDidVC = exports.createPublicDidVC = exports.createGenericVC = exports.createTokenTransferVC = exports.createMintSlashVC = exports.createTokenVC = void 0;
const connection_1 = require("./connection");
const helper_1 = require("./common/helper");
const did_1 = require("./did");
const util_crypto_1 = require("@polkadot/util-crypto");
const util_1 = require("@polkadot/util");
const _1 = require(".");
const utils_1 = require("./utils");
const config_1 = require("./config");
const axios_1 = __importDefault(require("axios"));
/**
 * Encodes Token VC and pads with appropriate bytes
 * @param {Object} TokenVC
 * @param {String} TokenVC.tokenName
 * @param {String} TokenVC.reservableBalance
 * @param {String} TokenVC.decimal
 * @param {String} TokenVC.currencyCode
 * @returns {HexString} Token VC Hex String
 */
function createTokenVC({ tokenName, reservableBalance, decimal, currencyCode }) {
    if (!tokenName) {
        throw new Error('Token name is required');
    }
    if (tokenName.length > _1.utils.TOKEN_NAME_BYTES) {
        throw new Error('Token name should not exceed 16 chars');
    }
    if (!currencyCode) {
        throw new Error('Currency code is required');
    }
    if (currencyCode.length > _1.utils.CURRENCY_CODE_BYTES) {
        throw new Error('Currency Code should not exceed 8 chars');
    }
    if (!_1.utils.isUpperAndValid(currencyCode)) {
        throw new Error('Only Upper case characters with no space are allowed for currency code');
    }
    if (!reservableBalance) {
        throw new Error('Reservable balance is required');
    }
    if (!decimal) {
        throw new Error('Decimal is required');
    }
    let vcProperty = {
        token_name: _1.utils.encodeData(tokenName.padEnd(_1.utils.TOKEN_NAME_BYTES, '\0'), 'token_bytes'),
        reservable_balance: _1.utils.encodeData(reservableBalance * (Math.pow(10, decimal)), 'Balance'),
        decimal: _1.utils.encodeData(decimal, 'decimal'),
        currency_code: _1.utils.encodeData(currencyCode.padEnd(_1.utils.CURRENCY_CODE_BYTES, '\0'), 'currency_code'),
    };
    return _1.utils.encodeData(vcProperty, _1.utils.VCType.TokenVC)
        .padEnd((_1.utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}
exports.createTokenVC = createTokenVC;
/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} MintSlashVC VC Property
 * @param  {String} MintSlashVC.vcId VC Id
 * @param  {String} MintSlashVC.amount In Highest Form
 * @returns {HexString} Token VC Hex String
 */
function createMintSlashVC({ vc_id, amount }) {
    return __awaiter(this, void 0, void 0, function* () {
        let vcProperty = {
            vc_id: vc_id,
            amount: _1.utils.encodeData(amount, 'Balance'),
        };
        return _1.utils.encodeData(vcProperty, utils_1.VCType.SlashMintTokens)
            .padEnd((_1.utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
    });
}
exports.createMintSlashVC = createMintSlashVC;
/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} vcProperty VC Property
 * @param  {String} vcProperty.vcId VC Id
 * @param  {String} vcProperty.amount In Highest Form
 * @returns {HexString} Token VC Hex String
 */
function createTokenTransferVC({ vc_id, amount }) {
    return __awaiter(this, void 0, void 0, function* () {
        let vcProperty = {
            vc_id: vc_id,
            amount: _1.utils.encodeData(amount, 'Balance'),
        };
        return _1.utils.encodeData(vcProperty, utils_1.VCType.TokenTransferVC)
            .padEnd((_1.utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
    });
}
exports.createTokenTransferVC = createTokenTransferVC;
/** Encodes Generic VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {String} vcProperty.cid
 * @returns {HexString} Token VC Hex String
 */
function createGenericVC({ cid }) {
    let vcProperty = {
        cid: _1.utils.encodeData(cid.padEnd(_1.utils.CID_BYTES, '\0'), 'CID'),
    };
    return _1.utils.encodeData(vcProperty, utils_1.VCType.GenericVC)
        .padEnd((_1.utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}
exports.createGenericVC = createGenericVC;
/**
 * Create Public Did VC
 * @param {Object} publicDidVC
 * @param {String} publicDidVC.public_key
 * @param {String} publicDidVC.registration_number
 * @param {String} publicDidVC.company_name
 * @param {String} publicDidVC.did
 * @returns {HexString} Public Did VC Hex String
 */
function createPublicDidVC({ public_key, registration_number, company_name, did }) {
    let vcProperty = {
        public_key: _1.utils.encodeData(public_key, 'PublicKey'),
        registration_number: _1.utils.encodeData(registration_number, 'RegistrationNumber'),
        company_name: _1.utils.encodeData(company_name, 'CompanyName'),
        did: (0, did_1.sanitiseDid)(did),
    };
    return _1.utils.encodeData(vcProperty, utils_1.VCType.PublicDidVC)
        .padEnd((_1.utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}
exports.createPublicDidVC = createPublicDidVC;
/**
 * Create Private Did VC
 * @param {Object} privateDidVC
 * @param {String} privateDidVC.public_key
 * @param {String} privateDidVC.did
 * @returns {HexString} Private Did VC Hex String
 */
function createPrivateDidVC({ public_key, did }) {
    let vcProperty = {
        public_key: _1.utils.encodeData(public_key, 'PublicKey'),
        did: (0, did_1.sanitiseDid)(did),
    };
    return _1.utils.encodeData(vcProperty, utils_1.VCType.PrivateDidVC)
        .padEnd((_1.utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}
exports.createPrivateDidVC = createPrivateDidVC;
/**
 * Create VC
 * @param  {Object} vcProperty
 * @param  {String} owner Did
 * @param  {String[]} issuers Array of Did
 * @param  {String} vcType TokenVC, MintTokens, SlashTokens, TokenTransferVC, GenericVC
 * @param  {KeyPair} sigKeypair Owner Key Ring pair
 * @param  {ApiPromise} api (Optional)
 * @returns {String} VC Hex String
 */
function generateVC(vcProperty, owner, issuers, vcType, sigKeypair, api, ssidUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let encodedVCProperty, encodedData, hash;
        switch (vcType) {
            case utils_1.VCType.TokenVC:
                encodedVCProperty = createTokenVC(vcProperty);
                break;
            case utils_1.VCType.MintTokens:
            case utils_1.VCType.SlashTokens:
                encodedVCProperty = yield createMintSlashVC(vcProperty);
                break;
            case utils_1.VCType.TokenTransferVC:
                encodedVCProperty = yield createTokenTransferVC(vcProperty);
                break;
            case utils_1.VCType.GenericVC:
                encodedVCProperty = createGenericVC(vcProperty);
                let genericVCData = yield getGenericVCDataByCId(vcProperty.cid, ssidUrl);
                hash = genericVCData.hash;
                break;
            case utils_1.VCType.PublicDidVC:
                encodedVCProperty = createPublicDidVC(vcProperty);
                break;
            case utils_1.VCType.PrivateDidVC:
                encodedVCProperty = createPrivateDidVC(vcProperty);
                break;
            default:
                throw new Error("Unknown VC Type");
        }
        owner = _1.did.sanitiseDid(owner);
        issuers = issuers.map(issuer => _1.did.sanitiseDid(issuer));
        if (vcType != utils_1.VCType.GenericVC) {
            encodedData = _1.utils.encodeData({
                vc_type: vcType,
                vc_property: encodedVCProperty,
                owner: owner,
                issuers: issuers,
            }, "VC_HEX");
            hash = (0, util_crypto_1.blake2AsHex)(encodedData);
        }
        const sign = _1.utils.bytesToHex(sigKeypair.sign(hash));
        let vcObject = {
            hash,
            owner,
            issuers,
            signatures: [sign],
            is_vc_used: false,
            is_vc_active: false,
            vc_type: vcType,
            vc_property: encodedVCProperty,
        };
        return _1.utils.encodeData(vcObject, 'VC');
    });
}
exports.generateVC = generateVC;
// Common VC Functions -  
// encode_vc,
// decode_vc,
// encode_vc_property, 
// decode_vc_property
// Chain State Query Functions
/**
 * Lookup a VC
 * @param {HexString} did VC Owner's did
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
function getVCIdsByDID(did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return yield (yield provider.query.vc.lookup((0, did_1.sanitiseDid)(did))).toJSON();
    });
}
exports.getVCIdsByDID = getVCIdsByDID;
/**
 * Reverse lookup a VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
function getDIDByVCId(vcId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return yield (yield provider.query.vc.rLookup(vcId)).toJSON();
    });
}
exports.getDIDByVCId = getDIDByVCId;
/**
 * Get VCs by VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
function getVCs(vcId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.vc.vCs(vcId)).toJSON();
    });
}
exports.getVCs = getVCs;
/**
 * Get VC Approver List from the chain
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Approver List
 */
function getVCApprovers(vcId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.vc.vcApproverList(vcId)).toJSON();
    });
}
exports.getVCApprovers = getVCApprovers;
/**
 * Get VC History using vcId
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC History
 */
function getVCHistoryByVCId(vcId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return yield (yield provider.query.vc.vcHistory(vcId)).toJSON();
    });
}
exports.getVCHistoryByVCId = getVCHistoryByVCId;
/**
 * Get Generic vc data
 * @param {String} vcId
 * @param {ApiPromise} api
 * @returns {JSON} Generic VC data
 */
function getGenericVCDataByCId(cid, ssidUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        ssidUrl = ssidUrl || config_1.SSID_BASE_URL.local;
        let body = {
            action: "get_vc",
            cid: cid.startsWith('0x') ? _1.utils.hexToString(cid) : cid,
        };
        const { data: { message } } = yield axios_1.default.post(`${ssidUrl}/handleGenericVC`, body);
        return { data: message.data, hash: message.hash };
    });
}
/**
 * Get Generic vc data
 * @param {String} vcId
 * @param {ApiPromise} api
 * @returns {JSON} Generic VC data
 */
function getGenericVCData(vcId, ssidUrl, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = (yield api) || (yield (0, connection_1.buildConnection)('local'));
        const vc = yield getVCs(vcId, provider);
        if (!vc)
            return null;
        const vc_property = getVCProperty(vc.vcProperty, vc.vcType);
        const { data, hash } = yield getGenericVCDataByCId(vc_property.cid, ssidUrl);
        return { data, hash, vcId, issuers: vc.issuers };
    });
}
exports.getGenericVCData = getGenericVCData;
/**
 * Verify Generic Vc data
 * @param {String} vcId
 * @param {Object} data
 * @param {ApiPromise} api
 * @returns {Boolean} true if verified
 */
function verifyGenericVC(vcId, data, api) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = api || (yield (0, connection_1.buildConnection)('local'));
            const vc = yield getVCs(vcId, provider);
            // console.log(vc);
            // Verify Hash
            const generateHash = _1.utils.generateObjectHash(data);
            if (vc.hash !== generateHash) {
                throw new Error("Hash mismatch");
            }
            const history = yield getVCHistoryByVCId(vcId, provider);
            // console.log("VC History : ", history);
            if (!history)
                return false;
            // Get public keys
            const publicKeys = yield Promise.all(vc.issuers.map(issuer => _1.did.resolveDIDToAccount(issuer, provider, history[1])));
            // Verify signature
            vc.signatures.forEach(sign => {
                let isSignValid = false;
                publicKeys.forEach(key => {
                    if (!key) {
                        return;
                    }
                    if ((0, util_crypto_1.signatureVerify)((0, util_1.hexToU8a)(vc.hash), (0, util_1.hexToU8a)(sign), key.toString()).isValid) {
                        isSignValid = true;
                    }
                });
                if (!isSignValid) {
                    throw new Error("Signature verification failed");
                }
            });
            return true;
        }
        catch (err) {
            console.log("VC Verification Failed: ", err);
            return false;
        }
    });
}
exports.verifyGenericVC = verifyGenericVC;
// Extrinsics Functions
/**
* Approve VC
* @param  {HexString} vcID vc_id of VC to be approved
* @param  {KeyringPair} senderAccountKeyPair Issuer Key Ring pair
* @param {APIPromise} api
* @returns {Object} Transaction Object
*/
function approveVC(vcId, senderAccountKeyPair, api, ssidUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        // fetching VC from chain
        let vc_details = yield getVCs(vcId, provider);
        if (!vc_details) {
            throw new Error('VC not found');
        }
        const vc = vc_details;
        let hash;
        // generating the signature
        if (vc.vcType != utils_1.VCType.GenericVC) {
            const encodedData = _1.utils.encodeData({
                vc_type: vc.vcType,
                vc_property: vc.vcProperty,
                owner: vc.owner,
                issuers: vc.issuers
            }, "VC_HEX");
            hash = (0, util_crypto_1.blake2AsHex)(encodedData);
        }
        else {
            const vcProperty = getVCProperty(vc.vcProperty, vc.vcType);
            let genericVCData = yield getGenericVCDataByCId(vcProperty.cid, ssidUrl);
            hash = genericVCData.hash;
        }
        const sign = _1.utils.bytesToHex(senderAccountKeyPair.sign(hash));
        // console.log("Sign", sign);
        // adding signature to the chain
        const tx = provider.tx.vc.addSignature(vcId, sign);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.approveVC = approveVC;
/**
 * Store VC Hex in the chain
 * @param {HexString} vcHex
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function storeVC(vcHex, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)("local"));
        const tx = provider.tx.vc.store(vcHex);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.storeVC = storeVC;
/**
 * Update Status of a VC ID
 * @param {String} vcId
 * @param {Boolean} vcStatus
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function updateStatus(vcId, vcStatus, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)("local"));
        const tx = provider.tx.vc.updateStatus(vcId, vcStatus);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.updateStatus = updateStatus;
// Util Functions - Encode / Decode / getFormattedTokenAmount
/** function that decodes hex of createTokenVC
* @param  {String} hexValue Hex String to be decoded
* @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
* @returns {Object | String} Decoded Object/String
*/
function getVCProperty(hexValue, VCType) {
    let vcs = (0, utils_1.decodeHex)(hexValue, VCType);
    if (Boolean(vcs.token_name))
        vcs["token_name"] = (0, utils_1.hexToString)(vcs.token_name);
    if (Boolean(vcs.currency_code))
        vcs["currency_code"] = (0, utils_1.hexToString)(vcs.currency_code);
    return vcs;
}
exports.getVCProperty = getVCProperty;
/** function that decodes hex of createVC where type is TokenVC to it's corresponding object/value
 * @param  {String} hexValue Hex String to be decoded
 * @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | String} Decoded Object/String
 */
function decodeVC(hexValue, VCType) {
    let vcs = (0, utils_1.decodeHex)(hexValue, VCType);
    vcs["owner"] = (0, utils_1.hexToString)(vcs.owner);
    let issuer_did = [];
    for (let i = 0; i < vcs.issuers.length; i++) {
        issuer_did.push((0, utils_1.hexToString)(vcs.issuers[i]));
    }
    vcs["issuers"] = issuer_did;
    switch (vcs.vc_type) {
        case VCType.MintTokens:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, VCType.SlashMintTokens);
            break;
        case VCType.TokenVC:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, vcs.vc_type);
            break;
        case VCType.SlashTokens:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, VCType.SlashMintTokens);
            break;
        case VCType.TokenTransferVC:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, VCType.TokenTransferVC);
            break;
        case VCType.GenericVC:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, VCType.GenericVC);
            break;
        case VCType.PublicDidVC:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, VCType.PublicDidVC);
            break;
        case VCType.PrivateDidVC:
            vcs["vc_property"] = getVCProperty(vcs.vc_property, VCType.PrivateDidVC);
        default:
            throw new Error("Unknown Type");
    }
    return vcs;
}
exports.decodeVC = decodeVC;
/**
 * @param {String} tokenSymbol
 * @param {String} tokenAmount
 * @param {ApiPromise} api
 * @returns {String} Formatted Token Amount
 */
function getFormattedTokenAmount(tokenSymbol, tokenAmount, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield api.rpc.system.properties();
        const tokenData = token.toHuman();
        let amount_decimals = 0;
        if ((0, utils_1.hexToString)(tokenSymbol) !== tokenData.tokenSymbol[0]) {
            throw new Error("Invalid token symbol");
        }
        // Check if valid number or not
        if (isNaN(Number(tokenAmount))) {
            throw new Error(`Invalid token amount!`);
        }
        if (String(tokenAmount).includes('.')) {
            amount_decimals = String(tokenAmount).split('.')[1].length;
        }
        ;
        if (amount_decimals > Number(tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0])) {
            throw new Error(`Invalid token amount, max supported decimal by ${tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenSymbol'][0]} is ${tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0]}`);
        }
        tokenAmount = String(Math.round(parseFloat(tokenAmount) * (Math.pow(10, tokenData === null || tokenData === void 0 ? void 0 : tokenData['tokenDecimals'][0]))));
        return tokenAmount;
    });
}
exports.getFormattedTokenAmount = getFormattedTokenAmount;
