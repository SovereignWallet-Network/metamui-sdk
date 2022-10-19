import { buildConnection } from "./connection";
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { submitTransaction } from "./common/helper";
import { sanitiseDid } from "./did";
import { signatureVerify, blake2AsHex } from "@polkadot/util-crypto";
import { hexToU8a } from "@polkadot/util";
import { bool } from "@polkadot/types";
import { HexString } from "@polkadot/util/types";
import { AnyJson, AnyString } from "@polkadot/types/types";
import { did, utils } from ".";
import { decodeHex, hexToString, VCType } from "./utils";
import { SSID_BASE_URL } from "./config";
import axios from "axios";

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
    if(!reservableBalance) {
        throw new Error('Reservable balance is required');
    }
    if(!decimal) {
        throw new Error('Decimal is required');
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


/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} MintSlashVC
 * @param  {String} MintSlashVC.vcId
 * @param  {String} MintSlashVC.currencyCode
 * @param  {String} MintSlashVC.amount In Highest Form
 * @returns {String} Token VC Hex String
 */
 async function createMintSlashVC({ vcId, currencyCode, amount }, api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  let tokenAmount = await getFormattedTokenAmount(currencyCode, amount, provider);
  let vcProperty = {
    vc_id: vcId,
    amount: utils.encodeData(tokenAmount, 'Balance'),
  };
  return utils.encodeData(vcProperty, VCType.SlashMintTokens)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {String} vcProperty.vcId 
 * @param  {String} vcProperty.vcId 
 * @param  {String} vcProperty.vcId 
 * @param  {String} vcProperty.currencyCode
 * @param  {String} vcProperty.amount In Highest Form
 * @returns {String} Token VC Hex String
 */
async function createTokenTransferVC({ vcId, currencyCode, amount }, api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  let tokenAmount = await getFormattedTokenAmount(currencyCode, amount, provider);
  let vcProperty = {
    vc_id: vcId,
    amount: utils.encodeData(tokenAmount, 'Balance'),
  };
  return utils.encodeData(vcProperty, VCType.TokenTransferVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/** Encodes Generic VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {String} vcProperty.cid
 * @returns {HexString} Token VC Hex String
 */
function createGenericVC({ cid }) {
  let vcProperty = {
    cid: utils.encodeData(cid.padEnd(utils.CID_BYTES, '\0'), 'CID'),
  };
  return utils.encodeData(vcProperty, VCType.GenericVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/**
 * Create Public Did VC
 * @param {Object} publicDidVC
 * @param {String} publicDidVC.public_key
 * @param {String} publicDidVC.did
 * @param {String} publicDidVC.registration_number
 * @param {String} publicDidVC.company_name
 * @returns {HexString} Public Did VC Hex String
 */
function createPublicDidVC({ public_key, did, registration_number, company_name }) {
  let vcProperty = {
    public_key: utils.encodeData(public_key, 'PublicKey'),
    did: sanitiseDid(did),
    registration_number: utils.encodeData(registration_number, 'RegistrationNumber'),
    company_name: utils.encodeData(company_name, 'CompanyName'),
  };
  return utils.encodeData(vcProperty, VCType.PublicDidVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/**
 * Create Private Did VC
 * @param {Object} privateDidVC
 * @param {String} privateDidVC.public_key
 * @param {String} privateDidVC.did
 * @returns {HexString} Private Did VC Hex String
 */
function createPrivateDidVC({ public_key, did }) {
  let vcProperty = {
    public_key: utils.encodeData(public_key, 'PublicKey'),
    did: sanitiseDid(did),
  };
  return utils.encodeData(vcProperty, VCType.PrivateDidVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/**
 * Create VC
 * @param  {Object} vcProperty
 * @param  {String} owner Did
 * @param  {String[]} issuers Array of Did
 * @param  {String} vcType TokenVC, MintTokens, SlashTokens, TokenTransferVC, GenericVC
 * @param  {KeyPair} sigKeypair Owner Key Ring pair
 * @returns {String} VC Hex String
 */

 async function generateVC(vcProperty, owner, issuers, vcType, sigKeypair, api?: ApiPromise, ssidUrl?: string) {
  let encodedVCProperty, encodedData, hash;
  switch (vcType) {
    case VCType.TokenVC:
      encodedVCProperty = createTokenVC(vcProperty);
      break;
    case VCType.MintTokens:
    case VCType.SlashTokens:
      encodedVCProperty = await createMintSlashVC(vcProperty, api);
      break;
    case VCType.TokenTransferVC:
      encodedVCProperty = await createTokenTransferVC(vcProperty, api);
      break;
    case VCType.GenericVC:
      encodedVCProperty = createGenericVC(vcProperty);
      let genericVCData = await getGenericVCDataByCId(vcProperty.cid, ssidUrl);
      hash = genericVCData.hash;
      break;
    case VCType.PublicDidVC:
      encodedVCProperty = createPublicDidVC(vcProperty);
      break;
    case VCType.PrivateDidVC:
      encodedVCProperty = createPrivateDidVC(vcProperty);
      break;
    default:
      throw new Error("Unknown VC Type");
  }
  owner = did.sanitiseDid(owner);
  issuers = issuers.map(issuer => did.sanitiseDid(issuer));
  if (vcType != VCType.GenericVC) {
    encodedData = utils.encodeData({
      vc_type: vcType,
      vc_property: encodedVCProperty,
      owner,
      issuers,
    }, "VC_HEX");
    hash = blake2AsHex(encodedData);
  }
  const sign = utils.bytesToHex(sigKeypair.sign(hash));
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
  return utils.encodeData(vcObject, 'VC');
}
// Common VC Functions -  
// encode_vc,
// decode_vc,
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


/**
 * Get Generic vc data
 * @param {String} vcId
 * @param {ApiPromise} api
 * @returns {JSON} Generic VC data
 */
 async function getGenericVCDataByCId(cid, ssidUrl?: string) {
  ssidUrl = ssidUrl || SSID_BASE_URL.local;
  let body = {
    action: "get_vc",
    cid: cid.startsWith('0x') ? utils.hexToString(cid) : cid,
  };
  const { data: { message } } = await axios.post(`${ssidUrl}/handleGenericVC`, body);
  return { data: message.data, hash: message.hash };
}

/**
 * Get Generic vc data
 * @param {String} vcId
 * @param {ApiPromise} api
 * @returns Generic VC data
 */
async function getGenericVCData(vcId, ssidUrl: string, api: ApiPromise): Promise<AnyJson> {
  const provider = await api || (await buildConnection('local'));
  const vc = await getVCs(vcId, provider);
  if (!vc) return null
  const vc_property = getVCProperty(vc[0].vc_property, vc[0].vc_type);
  const { data, hash } = await getGenericVCDataByCId(vc_property.cid, ssidUrl);
  return { data, hash, vcId, issuers: vc[0].issuers };
}


/**
 * Verify Generic Vc data
 * @param {String} vcId
 * @param {Object} data
 * @param {ApiPromise} api
 * @returns {Boolean} true if verified
 */
 async function verifyGenericVC(vcId, data, api: ApiPromise) {
  try {
    const provider = api || (await buildConnection('local'));
    const vc = (await getVCProperty(vcId, provider))?.[0];

    // Verify Hash
    const generateHash = utils.generateObjectHash(data);
    if (vc.hash !== generateHash) {
      throw new Error("Hash mismatch");
    }

    const history = await getVCHistoryByVCId(vcId, provider);
    if (!history) return false

    // Get public keys
    const publicKeys = await Promise.all(vc.issuers.map(issuer => did.resolveDIDToAccount(issuer, provider, history[1])));

    // Verify signature
    vc.signatures.forEach(sign => {
      let isSignValid = false;
      publicKeys.forEach(key => {
        if (!key) {
          return;
        }
        if (signatureVerify(hexToU8a(vc.hash), hexToU8a(sign), key.toString()).isValid) {
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
}

// Extrinsics Functions

/**
* Approve VC
* @param  {HexString} vcID vc_id of VC to be approved
* @param  {KeyPair} senderAccountKeyPair Issuer Key Ring pair
* @param {APIPromise} api
* @returns {String} Transaction hash or Error
*/
async function approveVC(vcId: HexString, senderAccountKeyPair: KeyringPair, api: ApiPromise, ssidUrl?: string) {
    const provider = api || (await buildConnection('local'));

    // fetching VC from chain
    let vc_details = await getVCs(vcId, provider);
    if (!vc_details) {
      throw new Error('VC not found');
    }

    const vc = vc_details[0];
    let hash: string = '';

    // generating the signature
    if (vc.vc_type != VCType.GenericVC) {
      const encodedData = utils.encodeData({
        vc_type: vc['vc_type'],
        vc_property: vc['vc_property'],
        owner: vc['owner'],
        issuers: vc['issuers']
      }, "VC_HEX");
      hash = blake2AsHex(encodedData);
    } else {
      const vcProperty = getVCProperty(vc.vc_property, vc.vc_type);
      let genericVCData = await getGenericVCDataByCId(vcProperty.cid, ssidUrl);
      hash = genericVCData.hash;
    }
    const sign = utils.bytesToHex(senderAccountKeyPair.sign(hash));

    // adding signature to the chain
    const tx = provider.tx.vc.addSignature(vcId, sign);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}


/**
 * Store VC Hex in the chain
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
    const tx =
    //  provider.tx.sudo.sudo(
      provider.tx.vc.store(vcHex);
      // );
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
  vcStatus,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
    const provider = api || (await buildConnection("local"));
    const tx = provider.tx.vc.updateStatus(vcId, vcStatus);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

// Util Functions - Encode / Decode / getFormattedTokenAmount


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

async function getFormattedTokenAmount(
  tokenSymbol: string,
  tokenAmount: string,
  api: ApiPromise
) {
    const tokenData = await api.rpc.system.properties();
    let amount_decimals = 0;

    if(tokenSymbol !== tokenData?.['tokenSymbol'][0]) {
      throw new Error("Invalid token symbol");
    }
    // Check if valid number or not
    if (isNaN(Number(tokenAmount))) {
      throw new Error(`Invalid token amount!`);
    }
    if (tokenAmount.includes('.')) {
      amount_decimals = tokenAmount.split('.')[1].length;
    };
    if (amount_decimals > Number(tokenData?.['tokenDecimals'][0])) {
      throw new Error(`Invalid token amount, max supported decimal by ${tokenData?.['tokenSymbol'][0]} is ${tokenData?.['tokenDecimals'][0]}`);
    }
    tokenAmount = String(Math.round(parseFloat(tokenAmount) * (Math.pow(10, tokenData?.['tokenDecimals'][0]))));
    return tokenAmount;
}

export {
    createTokenVC,
    createMintSlashVC,
    createTokenTransferVC,
    createGenericVC,
    createPublicDidVC,
    createPrivateDidVC,
    getVCIdsByDID,
    getDIDByVCId,
    getVCs,
    getVCApprovers,
    getVCHistoryByVCId,
    getGenericVCData,
    generateVC,
    verifyGenericVC,
    approveVC,
    storeVC,
    updateStatus,
    decodeVC,
    getVCProperty,
    getFormattedTokenAmount,
};