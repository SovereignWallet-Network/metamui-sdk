"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectHash = exports.sortObjectByKeys = exports.isUpperAndValid = exports.vcHexToVcId = exports.decodeHex = exports.encodeData = exports.stringToBytes = exports.hexToString = exports.base58ToBytes = exports.hexToBytes = exports.bytesToHex = exports.VCType = exports.CID_BYTES = exports.VC_PROPERTY_BYTES = exports.CURRENCY_CODE_BYTES = exports.TOKEN_NAME_BYTES = exports.METABLOCKCHAIN_TYPES = void 0;
const util_1 = require("@polkadot/util");
const util_crypto_1 = require("@polkadot/util-crypto");
const types = __importStar(require("@polkadot/types"));
const VCType = {
    TokenVC: "TokenVC",
    MintTokens: "MintTokens",
    SlashTokens: "SlashTokens",
    TokenTransferVC: "TokenTransferVC",
    SlashMintTokens: "SlashMintTokens",
    GenericVC: "GenericVC",
    PublicDidVC: "PublicDidVC",
    PrivateDidVC: "PrivateDidVC",
};
exports.VCType = VCType;
Object.freeze(VCType);
const METABLOCKCHAIN_TYPES = {
    "MaxMetadata": "ConstU32<32>",
    "MaxRegNumLen": "ConstU32<32>",
    "MaxCompNameLen": "ConstU32<32>",
    "PeerId": "OpaquePeerId",
    "identifier": "[u8;32]",
    "public_key": "[u8;32]",
    "DidMetadata": "BoundedVec<u8, MaxMetadata>",
    "VCProp": "[u8;128]",
    "RegistrationNumber": "BoundedVec<u8, MaxMetadata>",
    "CompanyName": "BoundedVec<u8, MaxCompNameLen>",
    "PrivateDidVC": {
        "public_key": "public_key",
        "did": "identifier"
    },
    "PublicDidVC": {
        "public_key": "public_key",
        "registration_number": "RegistrationNumber",
        "company_name": "CompanyName",
        "did": "identifier",
    },
    "PrivateDid": {
        "identifier": "Did",
        "public_key": "PublicKey",
        "metadata": "DidMetadata"
    },
    "PublicDid": {
        "identifier": "Did",
        "public_key": "PublicKey",
        "metadata": "DidMetadata",
        "registration_number": "RegistrationNumber",
        "company_name": "CompanyName"
    },
    "Did": "[u8;32]",
    "DIdentity": {
        "_enum": {
            "Public": "PublicDid",
            "Private": "PrivateDid"
        }
    },
    "PublicKey": "[u8;32]",
    "Address": "MultiAddress",
    "LookupSource": "MultiAddress",
    "Balance": "u128",
    "TreasuryProposal": {
        "proposer": "Did",
        "beneficiary": "Did",
        "value": "Balance",
        "bond": "Balance"
    },
    "CurrencyId": "u32",
    "Amount": "i64",
    "Memo": "Vec<u8>",
    "AccountInfo": "AccountInfoWithTripleRefCount",
    "VC": {
        "hash": "Hash",
        "owner": "Did",
        "issuers": "Vec<Did>",
        "signatures": "Vec<Signature>",
        "is_vc_used": "bool",
        "is_vc_active": "bool",
        "vc_type": "VCType",
        "vc_property": "VCProp"
    },
    "VCType": {
        "_enum": [
            "TokenVC",
            "SlashTokens",
            "MintTokens",
            "TokenTransferVC",
            "GenericVC",
            "PublicDidVC",
            "PrivateDidVC"
        ]
    },
    "TokenVC": {
        "token_name": "[u8;16]",
        "reservable_balance": "Balance",
        "decimal": "u8",
        "currency_code": "[u8;8]"
    },
    "SlashMintTokens": {
        "vc_id": "VCid",
        "amount": "u128"
    },
    "TokenTransferVC": {
        "vc_id": "VCid",
        "amount": "u128"
    },
    "GenericVC": {
        "cid": "[u8;64]"
    },
    "VCHash": "Vec<u8>",
    "VCStatus": {
        "_enum": [
            "Active",
            "Inactive"
        ]
    },
    "VCid": "[u8;32]",
    "Hash": "H256",
    "Signature": "H512",
    "TokenDetails": {
        "token_name": "Vec<u8>",
        "currency_code": "Vec<u8>",
        "decimal": "u8",
        "block_number": "BlockNumber"
    },
    "TokenBalance": "u128",
    "TokenAccountData": {
        "free": "TokenBalance",
        "reserved": "TokenBalance",
        "frozen": "TokenBalance"
    },
    "TokenAccountInfo": {
        "nonce": "u32",
        "data": "TokenAccountData"
    },
    "Votes": {
        "index": "ProposalIndex",
        "threshold": "MemberCount",
        "ayes": "Vec<Did>",
        "nays": "Vec<Did>",
        "end": "BlockNumber"
    },
    "CurrencyCode": "[u8;8]",
    "StorageVersion": {
        "_enum": [
            "V1_0_0",
            "V2_0_0",
            "V3_0_0"
        ]
    },
    "VCPalletVersion": {
        "_enum": [
            "V1_0_0",
            "V2_0_0"
        ]
    }
};
exports.METABLOCKCHAIN_TYPES = METABLOCKCHAIN_TYPES;
// Types for generating HEX
const ENCODE_TYPES = {
    "VC_HEX": {
        "vc_type": "VCType",
        "vc_property": "VCProp",
        "owner": "Did",
        "issuers": "Vec<Did>"
    },
    "decimal": "u8",
    "currency_code": "[u8;8]",
    "token_bytes": "[u8;16]",
    "CID": "[u8;64]",
};
const TOKEN_NAME_BYTES = 16;
exports.TOKEN_NAME_BYTES = TOKEN_NAME_BYTES;
const CURRENCY_CODE_BYTES = 8;
exports.CURRENCY_CODE_BYTES = CURRENCY_CODE_BYTES;
const VC_PROPERTY_BYTES = 128;
exports.VC_PROPERTY_BYTES = VC_PROPERTY_BYTES;
const CID_BYTES = 64;
exports.CID_BYTES = CID_BYTES;
/**
 * @param  {Bytes} inputBytes u8[]
 */
const bytesToHex = (inputBytes) => (0, util_1.u8aToHex)(inputBytes);
exports.bytesToHex = bytesToHex;
/**
 * @param  {string} inputString
 */
const hexToBytes = (inputString) => (0, util_1.hexToU8a)(inputString);
exports.hexToBytes = hexToBytes;
/**
 * @param  {Base58} bs58string
 */
const base58ToBytes = (bs58string) => (0, util_crypto_1.base58Decode)(bs58string);
exports.base58ToBytes = base58ToBytes;
/**
 * @param  {String} inputString
 */
const stringToBytes = (inputString) => (0, util_1.stringToU8a)(inputString);
exports.stringToBytes = stringToBytes;
/**
 * @param  {Hex} hexString
 */
const hexToString = (hexString) => (0, util_1.hexToString)(hexString).replace(/^\0+/, '').replace(/\0+$/, '');
exports.hexToString = hexToString;
/**
 * @param {Hex} hexString
 */
const vcHexToVcId = (hexString) => (0, util_crypto_1.blake2AsHex)(hexString);
exports.vcHexToVcId = vcHexToVcId;
const registry = new types.TypeRegistry();
registry.register(METABLOCKCHAIN_TYPES);
registry.register(ENCODE_TYPES);
/** Encodes object/ string of given type to hex
 * @param  {Object | string} data Object to be encoded
 * @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {string} Encoded Hex
 */
function encodeData(data, typeKey) {
    return types.createType(registry, typeKey, data).toHex();
}
exports.encodeData = encodeData;
/** Decodes hex of given type to it's corresponding object/value
 * @param  {string} hexValue Hex String to be decoded
 * @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | string} Decoded Object/String
 */
function decodeHex(hexValue, typeKey) {
    return types.createType(registry, typeKey, hexValue).toJSON();
}
exports.decodeHex = decodeHex;
/** Checks if str is upper and only contains characters
 * @param  {} str
 * @returns bool
 */
function isUpperAndValid(str) {
    return /^[A-Z]+$/.test(str);
}
exports.isUpperAndValid = isUpperAndValid;
/** regex to remove unwanted hex bytes
 * @param  {string} s Hex String to make tidy
 * @returns {Object | string} Decoded tidy Object/String
 */
function tidy(s) {
    const tidy = typeof s === 'string'
        ? s.replace(/[\x00-\x1F\x7F-\xA0]+/g, '')
        : s;
    return tidy;
}
/** Sort object by keys
 * @param  {Object} unorderedObj unordered object
 * @returns {Object} ordered object by key
 */
function sortObjectByKeys(unorderedObj) {
    return Object.keys(unorderedObj).sort().reduce((obj, key) => {
        obj[key] = unorderedObj[key];
        return obj;
    }, {});
}
exports.sortObjectByKeys = sortObjectByKeys;
/** generate blake hash of js object
 * @param  {Object} unordered unordered object
 * @returns {Object} ordered object by key
 */
function generateObjectHash(object) {
    const sortedData = sortObjectByKeys(object);
    const encodedData = (0, util_1.stringToHex)(JSON.stringify(sortedData));
    return (0, util_crypto_1.blake2AsHex)(encodedData);
}
exports.generateObjectHash = generateObjectHash;
