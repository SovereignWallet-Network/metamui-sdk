import { buildConnection } from "./connection";
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { submitTransaction } from "./common/helper";
import { sanitiseDid } from "./did";
import { signatureVerify, blake2AsHex } from "@polkadot/util-crypto";
import { hexToU8a } from "@polkadot/util";
import { HexString } from "@polkadot/util/types";
import { AnyJson } from "@polkadot/types/types";
import { did, utils } from ".";
import { decodeHex, hexToString, VCType } from "./utils";
import { SSID_BASE_URL } from "./config";
import axios from "axios";

/**
 * Encodes Token VC and pads with appropriate bytes
 * @param {Object} TokenVC
 * @param {string} TokenVC.tokenName
 * @param {string} TokenVC.reservableBalance
 * @param {string} TokenVC.decimal
 * @param {string} TokenVC.currencyCode
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
 * @param  {Object} MintSlashVC VC Property
 * @param  {String} MintSlashVC.vcId VC Id
 * @param  {String} MintSlashVC.amount In Highest Form
 * @returns {HexString} Token VC Hex String
 */
 async function createMintSlashVC({ vc_id, currencyCode, amount }) {
  let vcProperty = {
    vc_id: vc_id,
    currency_code: utils.encodeData(currencyCode.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'currency_code'),
    amount: utils.encodeData(amount, 'Balance'),
  };
  return utils.encodeData(vcProperty, VCType.SlashMintTokens)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} vcProperty VC Property
 * @param  {string} vcProperty.vcId VC Id
 * @param  {string} vcProperty.amount In Highest Form
 * @returns {HexString} Token VC Hex String
 */
async function createTokenTransferVC({ vc_id, currencyCode, amount }) {
  let vcProperty = {
    vc_id: vc_id,
    currency_code: utils.encodeData(currencyCode.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'currency_code'),
    amount: utils.encodeData(amount, 'Balance'),
  };
  return utils.encodeData(vcProperty, VCType.TokenTransferVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/** Encodes Generic VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {string} vcProperty.cid
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
 * @param {string} publicDidVC.public_key
 * @param {string} publicDidVC.registration_number
 * @param {string} publicDidVC.company_name
 * @param {string} publicDidVC.did
 * @returns {HexString} Public Did VC Hex String
 */
function createPublicDidVC({ public_key, registration_number, company_name, did }) {
  let vcProperty = {
    public_key: utils.encodeData(public_key, 'PublicKey'),
    registration_number: utils.encodeData(registration_number, 'RegistrationNumber'),
    company_name: utils.encodeData(company_name, 'CompanyName'),
    did: sanitiseDid(did),
  };
  return utils.encodeData(vcProperty, VCType.PublicDidVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}


/**
 * Create Private Did VC
 * @param {Object} privateDidVC
 * @param {string} privateDidVC.public_key
 * @param {string} privateDidVC.did
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
 * @param  {string} owner Did
 * @param  {string[]} issuers Array of Did
 * @param  {string} vcType TokenVC, MintTokens, SlashTokens, TokenTransferVC, GenericVC
 * @param  {KeyPair} sigKeypair Owner Key Ring pair
 * @param  {string} ssidUrl (Optional)
 * @returns {string} VC Hex String
 */

 async function generateVC(vcProperty, owner, issuers, vcType, sigKeypair, ssidUrl?: string) {
  let encodedVCProperty, encodedData, hash;
  switch (vcType) {
    case VCType.TokenVC:
      encodedVCProperty = createTokenVC(vcProperty);
      break;
    case VCType.MintTokens:
    case VCType.SlashTokens:
      encodedVCProperty = await createMintSlashVC(vcProperty);
      break;
    case VCType.TokenTransferVC:
      encodedVCProperty = await createTokenTransferVC(vcProperty);
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
      owner: owner,
      issuers: issuers,
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

// Chain State Query Functions

/**
 * Lookup a VC 
 * @param {HexString} did VC Owner's did
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
async function getVCIdsByDID(
  did: string, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.lookup(sanitiseDid(did))).toJSON();
}


/**
 * Reverse lookup a VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
async function getDIDByVCId(
  vcId: HexString, 
  api: ApiPromise
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.rLookup(vcId)).toJSON();
}


/**
 * Get VCs by VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
async function getVCs(
  vcId: HexString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return (await provider.query.vc.vCs(vcId)).toJSON();
}


/**
 * Get VC Approver List from the chain
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Approver List
 */
async function getVCApprovers(
  vcId: HexString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return (await provider.query.vc.vcApproverList(vcId)).toJSON();
}


/**
 * Get VC History using vcId
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC History
 */
async function getVCHistoryByVCId(
  vcId: HexString, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vcHistory(vcId)).toJSON();
}


/**
 * Get Generic vc data
 * @param {string} vcId
 * @param {ApiPromise} api
 * @returns {JSON} Generic VC data
 */
 async function getGenericVCDataByCId(cid, ssidUrl?: String) {
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
 * @param {string} vcId
 * @param {ApiPromise} api
 * @returns {JSON} Generic VC data
 */
async function getGenericVCData(vcId, ssidUrl: string, api: ApiPromise): Promise<AnyJson> {
  const provider = await api || (await buildConnection('local'));
  const vc:any = await getVCs(vcId, provider);
  if (!vc) return null
  const vc_property = decodeVCProperty(vc.vcProperty, vc.vcType);
  const { data, hash } = await getGenericVCDataByCId(vc_property.cid, ssidUrl);
  return { data, hash, vcId, issuers: vc.issuers };
}


/**
 * Verify Generic Vc data
 * @param {string} vcId
 * @param {Object} data
 * @param {ApiPromise} api
 * @returns {Boolean} true if verified
 */
 async function verifyGenericVC(vcId, data, api: ApiPromise) {
  try {
    const provider = api || (await buildConnection('local'));
    const vc:any = await getVCs(vcId, provider);
    // console.log(vc);
    // Verify Hash
    const generateHash = utils.generateObjectHash(data);
    if (vc.hash !== generateHash) {
      throw new Error("Hash mismatch");
    }

    const history = await getVCHistoryByVCId(vcId, provider);
    // console.log("VC History : ", history);
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
* @param  {KeyringPair} senderAccountKeyPair Issuer Key Ring pair
* @param {ApiPromise} api
* @returns {Object} Transaction Object
*/
async function approveVC(vcId: HexString, senderAccountKeyPair: KeyringPair, api: ApiPromise, ssidUrl?: string) {
    const provider = api || (await buildConnection('local'));

    // fetching VC from chain
    let vc_details = await getVCs(vcId, provider);
    if (!vc_details) {
      throw new Error('VC not found');
    }

    const vc:any = vc_details;
    let hash;

    // generating the signature
    if (vc.vcType != VCType.GenericVC) {
      const encodedData = utils.encodeData({
        vc_type: vc.vcType,
        vc_property: vc.vcProperty,
        owner: vc.owner,
        issuers: vc.issuers
      }, "VC_HEX");
      hash = blake2AsHex(encodedData);
    } else {
      const vcProperty = decodeVCProperty(vc.vcProperty, vc.vcType);
      let genericVCData = await getGenericVCDataByCId(vcProperty.cid, ssidUrl);
      hash = genericVCData.hash;
    }
    const sign = utils.bytesToHex(senderAccountKeyPair.sign(hash));
    // console.log("Sign", sign);
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
 * @returns {Object} Transaction Object
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
 * @param {string} vcId
 * @param {Boolean} vcStatus
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function updateStatus(
  vcId: HexString,
  vcStatus: boolean,
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
 * @param  {string} hexValue Hex String to be decoded
 * @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | string} Decoded Object/String
 */
  function decodeVCProperty(hexValue, VCType) {
    let vcs = decodeHex(hexValue, VCType);
    switch(vcs.vc_type) {
      case VCType.TokenVC:
        vcs["token_name"] = hexToString(vcs.token_name);
        vcs["currency_code"] = hexToString(vcs.currency_code);
        break;
      case VCType.PublicDidVC:
        vcs["did"] = hexToString(vcs.did);
        vcs["registration_number"] = hexToString(vcs.registration_number);
        vcs["company_name"] = hexToString(vcs.company_name);
        break;
      case VCType.PrivateDidVC:
        vcs["did"] = hexToString(vcs.did);
        break;
    }
    return vcs;
   }
  
/** function that decodes hex of createVC where type is TokenVC to it's corresponding object/value
 * @param  {string} hexValue Hex String to be decoded
 * @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | string} Decoded Object/String
 */
function decodeVC(hexValue) {
    let vc = decodeHex(hexValue, "VC");
    vc["owner"] = hexToString(vc.owner);
    let issuer_did: any = [];
    for(let i=0; i<vc.issuers.length; i++){
        issuer_did.push(hexToString(vc.issuers[i]));
    }
    vc["issuers"] = issuer_did;
    switch(vc.vc_type) {
        
        case VCType.MintTokens:
        case VCType.SlashTokens:
        vc["vc_property"] = decodeVCProperty(vc.vc_property, VCType.SlashMintTokens);
        break;

        case VCType.GenericVC:
        case VCType.PublicDidVC:
        case VCType.PrivateDidVC:
        case VCType.TokenVC:
        case VCType.TokenTransferVC:
        vc["vc_property"] = decodeVCProperty(vc.vc_property, vc.vc_type);
        
        default:
        throw new Error("Unknown Type");
    }
    return vc;
}

/**
 * @param {string} tokenSymbol 
 * @param {string} tokenAmount 
 * @param {ApiPromise} api 
 * @returns {string} Formatted Token Amount
 */

async function getFormattedTokenAmount(
  tokenSymbol: string,
  tokenAmount: string,
  api: ApiPromise
) {
    const token = await api.rpc.system.properties();
    const tokenData: any = token.toHuman();
    let amount_decimals = 0;

    if(hexToString(tokenSymbol) !== tokenData.tokenSymbol[0]) {
      throw new Error("Invalid token symbol");
    }
    // Check if valid number or not
    if (isNaN(Number(tokenAmount))) {
      throw new Error(`Invalid token amount!`);
    }
    if (String(tokenAmount).includes('.')) {
      amount_decimals = String(tokenAmount).split('.')[1].length;
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
    decodeVCProperty,
    getFormattedTokenAmount,
};