/**
 * VC IMPLEMENTATION (MVP)
 * VC in metablockchain network is used as a certificate to prove certain details.
 * All VCs have to follow the params mentioned in the respective SCHEMA.
 *
 * VC is just a simple JSON document (for now), that contains the values
 * and is signed by the verifying authority.
 * We have to modify it to an interface or class to support generalised SCHEMAs.
 *
 * VC Format (For schemas and verifier DID already registered on blockchain) :
 * {
 *   "schema" : "Hash of the schema that the VC is using",
 *   "properties" : {
 *          // the properties JSON, this should be the same as the schema definition
 *          },
 *   "hash" : "SHA256 hash of the properties field",
 *   "verifier" : "The metablock did of the verifying authority",
 *   "signature" : "The signature of the verifier, verifying the hash"
 * }
 */
import { signatureVerify, blake2AsHex } from '@polkadot/util-crypto';
const sha256 = require('js-sha256');
import { sanitiseDid, resolveDIDToAccount } from './did';
import { buildConnection } from './connection';
import { VCType } from './utils';
import * as did from './did';
import * as utils from './utils';
// import { getFormattedTokenAmount } from './token';
// import { createVC, signVC, verifyVC } from './verified_credentials';
import { default as axios } from 'axios';
import { hexToU8a } from '@polkadot/util';
import { SSID_BASE_URL } from './config';
import { ApiPromise } from '@polkadot/api';
import { AnyJson } from '@polkadot/types/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { submitTransaction } from './common/helper';

/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} TokenVC
 * @param  {String} TokenVC.tokenName 
 * @param  {String} TokenVC.reservableBalance In Highest Form
 * @param  {String} TokenVC.decimal 
 * @param  {String} TokenVC.currencyCode 
 * @returns {String} Token VC Hex String
 */
function createTokenVC({ tokenName, reservableBalance, decimal, currencyCode }) {
  if (!tokenName) {
    throw new Error('Token name is required');
  }
  if (tokenName.length > utils.TOKEN_NAME_BYTES) {
    throw new Error('Token name should not exceed 16 chars');
  }
  if (!currencyCode) {
    throw new Error('Currency code is required');
  }
  if (currencyCode.length > utils.CURRENCY_CODE_BYTES) {
    throw new Error('Currency Code should not exceed 8 chars');
  }
  if (!utils.isUpperAndValid(currencyCode)) {
    throw new Error('Only Upper case characters with no space are allowed for currency code');
  }
  let vcProperty = {
    token_name: utils.encodeData(tokenName.padEnd(utils.TOKEN_NAME_BYTES, '\0'), 'token_bytes'),
    reservable_balance: utils.encodeData(reservableBalance * (Math.pow(10, decimal)), 'Balance'),
    decimal: utils.encodeData(decimal, 'decimal'),
    currency_code: utils.encodeData(currencyCode.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'currency_code'),
  };
  return utils.encodeData(vcProperty, VCType.TokenVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}

// /** Encodes Token VC and pads with appropriate bytes
//  * @param  {Object} vcProperty
//  * @param  {String} vcProperty.vcId 
//  * @param  {String} vcProperty.currencyCode
//  * @param  {String} vcProperty.amount In Highest Form
//  * @returns {String} Token VC Hex String
//  */
// async function createMintSlashVC({ vcId, currencyCode, amount }, api: ApiPromise) {
//   const provider = api || (await buildConnection('local'));
//   let tokenAmount = await getFormattedTokenAmount(currencyCode, amount, provider);
//   let vcProperty = {
//     vc_id: vcId,
//     currency_code: utils.encodeData(currencyCode.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'CurrencyCode'),
//     amount: utils.encodeData(tokenAmount, 'Balance'),
//   };
//   return utils.encodeData(vcProperty, VCType.SlashMintTokens)
//     .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
// }

// /** Encodes Token VC and pads with appropriate bytes
//  * @param  {Object} vcProperty
//  * @param  {String} vcProperty.vcId 
//  * @param  {String} vcProperty.currencyCode
//  * @param  {String} vcProperty.amount In Highest Form
//  * @returns {String} Token VC Hex String
//  */
// async function createTokenTransferVC({ vcId, currencyCode, amount }, api: ApiPromise) {
//   const provider = api || (await buildConnection('local'));
//   let tokenAmount = await getFormattedTokenAmount(currencyCode, amount, provider);
//   let vcProperty = {
//     vc_id: vcId,
//     currency_code: utils.encodeData(currencyCode.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'CurrencyCode'),
//     amount: utils.encodeData(tokenAmount, 'Balance'),
//   };
//   return utils.encodeData(vcProperty, VCType.TokenTransferVC)
//     .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
// }

/** Encodes Generic VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {String} vcProperty.cid
 * @returns {String} Token VC Hex String
 */
function createGenericVC({ cid }) {
  let vcProperty = {
    cid: utils.encodeData(cid.padEnd(utils.CID_BYTES, '\0'), 'CID'),
  };
  return utils.encodeData(vcProperty, VCType.GenericVC)
    .padEnd((utils.VC_PROPERTY_BYTES * 2) + 2, '0'); // *2 for hex and +2 bytes for 0x
}

// /**
//  * Create VC
//  * @param  {Object} vcProperty
//  * @param  {String} owner Did
//  * @param  {String[]} issuers Array of Did
//  * @param  {String} vcType TokenVC, MintTokens, SlashTokens, TokenTransferVC, GenericVC
//  * @param  {KeyPair} sigKeypair Owner Key Ring pair
//  * @returns {String} VC Hex String
//  */

// async function generateVC(vcProperty, owner, issuers, vcType, sigKeypair: KeyringPair, api: ApiPromise, ssidUrl: string | null = null) {
//   let encodedVCProperty, encodedData, hash;
//   switch (vcType) {
//     case VCType.TokenVC:
//       encodedVCProperty = createTokenVC(vcProperty);
//       break;
//     case VCType.MintTokens:
//     case VCType.SlashTokens:
//       encodedVCProperty = await createMintSlashVC(vcProperty, api);
//       break;
//     case VCType.TokenTransferVC:
//       encodedVCProperty = await createTokenTransferVC(vcProperty, api);
//       break;
//     case VCType.GenericVC:
//       encodedVCProperty = createGenericVC(vcProperty);
//       let genericVCData = await getGenericVCDataByCId(vcProperty.cid, ssidUrl);
//       hash = genericVCData.hash;
//       break;
//     default:
//       throw new Error("Unknown VC Type");
//   }
//   owner = did.sanitiseDid(owner);
//   issuers = issuers.map(issuer => did.sanitiseDid(issuer));
//   if (vcType != VCType.GenericVC) {
//     encodedData = utils.encodeData({
//       vc_type: vcType,
//       vc_property: encodedVCProperty,
//       owner,
//       issuers,
//     }, "VC_HEX");
//     hash = blake2AsHex(encodedData);
//   }
//   const sign = utils.bytesToHex(sigKeypair.sign(hash));
//   let vcObject = {
//     hash,
//     owner,
//     issuers,
//     signatures: [sign],
//     is_vc_used: false,
//     vc_type: vcType,
//     vc_property: encodedVCProperty,
//   };
//   return utils.encodeData(vcObject, 'VC');
// }

// /**
// * Approve VC
// * @param  {Object} vcID vc_id of VC to be approved
// * @param  {KeyPair} signingKeyPair Issuer Key Ring pair
// * @param {APIPromise} api
// * @returns {String} Transaction hash or Error
// */
// async function approveVC(vcId, signingKeyPair, api: ApiPromise, ssidUrl: string) {
//       const provider = api || (await buildConnection('local'));

//       // fetching VC from chain
//       let vc_details = await getVCs(vcId, provider);
//       if (!vc_details) {
//         throw(new Error('VC not found'));
//       }
//       const vc = vc_details?.[0];
//       let hash: string = '';

//       // generating the signature
//       if (vc.vc_type != VCType.GenericVC) {
//         const encodedData = utils.encodeData({
//           vc_type: vc['vc_type'],
//           vc_property: vc['vc_property'],
//           owner: vc['owner'],
//           issuers: vc['issuers']
//         }, "VC_HEX");
//         hash = blake2AsHex(encodedData);
//       } else {
//         const vcProperty = utils.getVCS(vc.vc_property, vc.vc_type);
//         let genericVCData = await getGenericVCDataByCId(vcProperty.cid, ssidUrl);
//         hash = genericVCData.hash;
//       }
//       const sign = utils.bytesToHex(signingKeyPair.sign(hash));

//       // adding signature to the chain
//       const tx = provider.tx.vc.addSignature(vcId, sign);

//       let nonce = await provider.rpc.system.accountNextIndex(signingKeyPair.address);
//       let signedTx = await tx.signAsync(signingKeyPair, { nonce });
//       return submitTransaction(signedTx, provider);
// }


/**
 * Store vc hex
 * @param {String} vcHex
 * @param {KeyPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function storeVC(
  vcHex: string,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise
) : Promise<string> {
      const provider = api || (await buildConnection('local'));

      const tx = provider.tx.vc.store(vcHex);

      let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
      let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
      return submitTransaction(signedTx, provider);
}

/**
 * Update Status
 * @param {String} vcId
 * @param {String} vcStatus
 * @param {KeyPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function updateStatus(
  vcId,
  vcStatus,
  senderAccountKeyPair,
  api: ApiPromise,
) {
      const provider = api || (await buildConnection('local'));

      const tx = provider.tx.vc.updateStatus(vcId, vcStatus);

      let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
      let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
      return submitTransaction(signedTx, provider);
}

/**
 * Get VCs by VC id
 * @param {String} vcId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {String} (false if not found)
 */
async function getVCs(vcId: string, api: ApiPromise): Promise<AnyJson> {
  const provider = api || (await buildConnection('local'));
  const data = (await provider.query.vc.vCs(vcId)).toHuman();
  return data;

}


async function getVCIdsByDID(did: string, api: ApiPromise): Promise<AnyJson> {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(did);
  const data = (await provider.query.vc.lookup(did_hex)).toHuman();
  return data;
}

/**
 * Get DID by VC Id
 * @param {String} vcId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {String} (false if not found)
 */
async function getDIDByVCId(vcId: string, api: ApiPromise): Promise<AnyJson> {
  const provider = api || (await buildConnection('local'));
  const data = (await provider?.query.vc.rLookup(vcId)).toHuman();
  return data;
}

/**
 * Get VC history by VC Id
 * @param {String} vcId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {String} (false if not found)
 */
async function getVCHistoryByVCId(vcId: string, api: ApiPromise): Promise<AnyJson> {
  const provider = api || (await buildConnection('local'));
  const data = (await provider?.query.vc.vCHistory(vcId)).toHuman();
  return data;
}

/**
 * Get approved issuers of the VC
 * @param {String} vcId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {Array<Did>} approved issuer list
 */
async function getVCApprovers(vcId, api: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  const approver_list = (await provider?.query.vc.vCApproverList(vcId)).toHuman();
  return approver_list;
}


async function getGenericVCDataByCId(cid, ssidUrl: any = false) {
  ssidUrl = ssidUrl || SSID_BASE_URL.local;
  let body = {
    action: "get_vc",
    cid: cid.startsWith('0x') ? utils.hexToString(cid) : cid,
  };
  const { data: { message } } = await axios.post(`${ssidUrl}/handleGenericVC`, body);
  return { data: message.data, hash: message.hash };
}

// /**
//  * Get Generic vc data
//  * @param {String} vcId
//  * @param {ApiPromise} api
//  * @returns {JSON} Generic VC data
//  */
// async function getGenericVCData(vcId, ssidUrl = false, api: ApiPromise) {
//   const provider = api || (await buildConnection('local'));
//   const vc = await getVCs(vcId, provider);
//   const vc_property = utils.getVCS(vc?.[0].vc_property, vc?.[0].vc_type);
//   const { data, hash } = await getGenericVCDataByCId(vc_property.cid, ssidUrl);
//   return { data, hash, vcId, issuers: vc?.[0].issuers };
// }


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
    const vc = (await getVCs(vcId, provider))?.[0];

    // Verify Hash
    const generateHash = utils.generateObjectHash(data);
    if (vc.hash !== generateHash) {
      throw new Error("Hash mismatch");
    }
    let history = await getVCHistoryByVCId(vcId, provider);

    // Get public keys
    const publicKeys = await Promise.all(vc.issuers.map(issuer => resolveDIDToAccount(issuer, provider, history?.[1])));

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

export {
  createTokenVC,
  // generateVC,
  // approveVC,
  storeVC,
  updateStatus,
  getVCs,
  getVCIdsByDID,
  getDIDByVCId,
  getVCHistoryByVCId,
  getVCApprovers,
  // createVC,
  // signVC,
  // verifyVC,
  // getGenericVCData,
  verifyGenericVC,
  getGenericVCDataByCId,
};