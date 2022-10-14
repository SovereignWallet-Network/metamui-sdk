import { buildConnection } from "./connection";
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { submitTransaction } from "./common/helper";
import { sanitiseDid } from "./did";
import { signatureVerify, blake2AsHex } from "@polkadot/util-crypto";
import { hexToU8a } from "@polkadot/util";
import { bool } from "@polkadot/types";
import { HexString } from "@polkadot/util/types";
import { AnyString } from "@polkadot/types/types";
import { utils } from ".";
import { decodeHex, hexToString } from "./utils";


// 
/**
 * Encodes Token VC and pads with appropriate bytes
 * @param {Object} TokenVC
 * @param {String} TokenVC.tokenName
 * @param {String} TokenVC.reservableBalance
 * @param {String} TokenVC.decimal
 * @param {String} TokenVC.currencyCode
 * @returns {HexString} Token VC Hex String
 */
function createTokenVC({ tokenName, reservableBalance, decimal, currencyCode}) {
    if(!tokenName) {
        throw new Error('Token name is required');
    }
    if(tokenName.length > utils.TOKEN_NAME_BYTES) {
        throw new Error('Token name should not exceed 16 chars');
    }
    if(!currencyCode) {
        throw new Error('Currency code is required');
    }
    if(currencyCode.length > utils.CURRENCY_CODE_BYTES) {
        throw new Error('Currency Code should not exceed 8 chars');
    }
    if(!utils.isUpperAndValid(currencyCode)){
        throw new Error('Only Upper case characters with no space are allowed for currency code');
    }
    let vcProperty = {
        token_name: utils.encodeData(tokenName.padEnd(utils.TOKEN_NAME_BYTES, '\0'), 'token_bytes'),
        reservable_balance: utils.encodeData(reservableBalance*(Math.pow(10,decimal)), 'Balance'),
        decimal: utils.encodeData(decimal, 'decimal'),
        currency_code: utils.encodeData(currencyCode.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'currency_code'),
    };
    return utils.encodeData(vcProperty, utils.VCType.TokenVC)
        .padEnd((utils.VC_PROPERTY_BYTES * 2)+2, '0'); // *2 for hex and +2 bytes for 0x
}




// Common VC Functions - 
// create_vc, 
// sign_vc, 
// verify_vc, 
// decode_vc, 
// encode_vc, 
// encode_vc_property, 
// decode_vc_property








// Chain State Query Functions

/**
 * Lookup a VC 
 * @param {AnyString} did VC Owner's did
 * @param {ApiPromise} api
 */
async function getVCIdsByDID(
  did: AnyString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.lookup(sanitiseDid(did))).toHuman();
}


/**
 * Reverse lookup a VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
async function getDIDByVCId(
  vcId: HexString, 
  api: ApiPromise
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.rLookup(vcId)).toHuman();
}


/**
 * Get VCs by VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
async function getVCs(
  vcId: HexString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vCs(vcId)).toHuman();
}


/**
 * Get VC Approver List from the chain
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
async function getVCApprovers(
  vcId: HexString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vcApproverList(vcId)).toHuman();
}


/**
 * Get VC History using vcId
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
async function getVCHistoryByVCId(
  vcId: HexString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vcHistory(vcId)).toHuman();
}

// Extrinsics Functions

/**
 * Add Signature to a VC ID
 * @param {HexString} vcId
 * @param {HexString} sign
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {HexString}
 */
async function addSign(
  vcId: HexString,
  sign: HexString,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
    const provider = api || (await buildConnection("local"));
    const tx = provider.tx.vc.addSignature(vcId, sign);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

/**
 * Store VCHex to the chain
 * @param {HexString} vcHex
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {hexString}
 */
async function storeVC(
  vcHex: HexString, 
  senderAccountKeyPair: KeyringPair, 
  api: ApiPromise
) {
    const provider = api || (await buildConnection("local"));
    const tx = provider.tx.vc.store(vcHex);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

/**
 * Update Status of a VC ID
 * @param {String} vcId
 * @param {Boolean} vcStatus
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function updateStatus(
  vcId: HexString,
  vcStatus: bool,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
    const provider = api || (await buildConnection("local"));
    const tx = provider.tx.vc.updateStatus(vcId, vcStatus);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

// Util Functions - Encode Decode


 /** function that decodes hex of createTokenVC
 * @param  {String} hexValue Hex String to be decoded
 * @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | String} Decoded Object/String
 */
  function getVCProperty(hexValue, VCType) {
    let vcs = decodeHex(hexValue, VCType);
    if(Boolean(vcs.token_name))
      vcs["token_name"] = hexToString(vcs.token_name);
    if(Boolean(vcs.currency_code))
      vcs["currency_code"] = hexToString(vcs.currency_code);
    return vcs;
   }
  
/** function that decodes hex of createVC where type is TokenVC to it's corresponding object/value
 * @param  {String} hexValue Hex String to be decoded
 * @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | String} Decoded Object/String
 */
function decodeVC(hexValue, VCType) {
    let vcs = decodeHex(hexValue, VCType);
    vcs["owner"] = hexToString(vcs.owner);
    let issuer_did: any = [];
    for(let i=0; i<vcs.issuers.length; i++){
        issuer_did.push(hexToString(vcs.issuers[i]));
    }
    vcs["issuers"] = issuer_did;
    switch(vcs.vc_type) {
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


export {
    getVCIdsByDID,
    getDIDByVCId,
    getVCs,
    getVCApprovers,
    getVCHistoryByVCId,
    addSign,
    storeVC,
    updateStatus,
    decodeVC,
    getVCProperty,
};