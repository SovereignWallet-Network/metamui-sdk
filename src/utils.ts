import { u8aToHex, hexToU8a, hexToString as polkadotHextoString, stringToU8a, stringToHex } from '@polkadot/util';
import { base58Decode, blake2AsHex } from '@polkadot/util-crypto';

import * as types from '@polkadot/types';

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
Object.freeze(VCType);

const METABLOCKCHAIN_TYPES = {
  "MaxMetadata": "ConstU32<32>",
  "MaxRegNumLen": "ConstU32<32>",
  "MaxCompNameLen": "ConstU32<32>",
  "MaxKeyChanges": "ConstU32<1000>",
  "PeerId": "OpaquePeerId",
  "Did": "[u8;32]",
  "PublicKey": "[u8;32]",
  "DidMetadata": "BoundedVec<u8, MaxMetadata>",
  "VCProp": "[u8;128]",
  "PrevKeysMap": "BoundedVec<(AccountId, BlockNumber), MaxKeyChanges>",

  "RegistrationNumber": "BoundedVec<u8, MaxMetadata>",
  "CompanyName": "BoundedVec<u8, MaxCompNameLen>",
  "PrivateDidVC": {
    "public_key": "PublicKey",
    "did": "Did"
  },
  "PublicDidVC": {
    "public_key": "PublicKey",
    "registration_number": "RegistrationNumber",
    "company_name": "CompanyName",
    "did": "Did",
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
  "DIdentity": {
    "_enum": {
      "Public": "PublicDid",
      "Private": "PrivateDid"
    }
  },
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
    "currency_code": "CurrencyCode",
    "amount": "u128"
  },
  "TokenTransferVC": {
    "vc_id": "VCid",
    "currency_code": "CurrencyCode",
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
  "Status": {
    "_enum": [
      "ToBeDeployed",
      "Deployed",
      "Removed"
    ]
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
}

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
  "Did": "[u8;32]",
};

const TOKEN_NAME_BYTES = 16;
const CURRENCY_CODE_BYTES = 8;
const VC_PROPERTY_BYTES = 128;
const CID_BYTES = 64;
const DID_BYTES = 32;

/**
 * @param  {Bytes} inputBytes u8[]
 */
const bytesToHex = (inputBytes) => u8aToHex(inputBytes);
/**
 * @param  {string} inputString
 */
const hexToBytes = (inputString) => hexToU8a(inputString);
/**
 * @param  {Base58} bs58string
 */
const base58ToBytes = (bs58string) => base58Decode(bs58string);
/**
 * @param  {String} inputString
 */
const stringToBytes = (inputString) => stringToU8a(inputString);
/**
 * @param  {Hex} hexString
 */
const hexToString = (hexString) => polkadotHextoString(hexString).replace(/^\0+/, '').replace(/\0+$/, '');


/**
 * @param {Hex} hexString
 */
const vcHexToVcId = (hexString) => blake2AsHex(hexString);

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

/** Decodes hex of given type to it's corresponding object/value
 * @param  {string} hexValue Hex String to be decoded
 * @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | string} Decoded Object/String
 */
function decodeHex(hexValue, typeKey) {
  return types.createType(registry, typeKey, hexValue).toJSON();
}

/** Checks if str is upper and only contains characters
 * @param  {} str
 * @returns bool
 */
function isUpperAndValid(str) {
  return /^[A-Z]+$/.test(str);
}

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
  return Object.keys(unorderedObj).sort().reduce(
    (obj, key) => {
      obj[key] = unorderedObj[key];
      return obj;
    },
    {}
  );
}

/** generate blake hash of js object
 * @param  {Object} unordered unordered object
 * @returns {Object} ordered object by key
 */
function generateObjectHash(object) {
  const sortedData = sortObjectByKeys(object);
  const encodedData = stringToHex(JSON.stringify(sortedData));
  return blake2AsHex(encodedData);
}

export {
  METABLOCKCHAIN_TYPES,
  TOKEN_NAME_BYTES,
  CURRENCY_CODE_BYTES,
  VC_PROPERTY_BYTES,
  CID_BYTES,
  DID_BYTES,
  VCType,
  bytesToHex,
  hexToBytes,
  base58ToBytes,
  hexToString,
  stringToBytes,
  encodeData,
  decodeHex,
  vcHexToVcId,
  isUpperAndValid,
  sortObjectByKeys,
  generateObjectHash,
  tidy
};