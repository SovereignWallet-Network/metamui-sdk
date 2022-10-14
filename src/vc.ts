import { buildConnection } from "./connection";
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { submitTransaction } from "./common/helper";
import { sanitiseDid } from "./did";

// Chain State Query Functions

/**
 * Lookup a VC 
 * @param {String} did VC Owner's did
 * 
 */
async function getVCIdsByDID(
  did, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.lookup(sanitiseDid(did))).toHuman();
}


/**
 * Reverse lookup a VC ID
 * @param {String} vcId
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function getDIDByVCId(
  vcId, 
  api: ApiPromise
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.rLookup(vcId)).toHuman();
}


/**
 * Get VCs by VC ID
 * @param {String} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
async function getVCs(
  vcId, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vCs(vcId)).toHuman();
}


/**
 * Get VC Approver List from the chain
 * @param {String} vcId
 * @param {APIPromise} api
 * @returns {String}
 */
async function getVCApprovers(
  vcId, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vcApproverList(vcId)).toHuman();
}


/**
 * Get VC History using vcId
 * @param {String} vcId
 * @param {APIPromise} api
 * @returns {String}
 */
async function getVCHistoryByVCId(
  vcId, 
  api: ApiPromise,
) {
    const provider = api || (await buildConnection('local'));
    return await (await provider.query.vc.vcHistory(vcId)).toHuman();
}

// Extrinsics Functions

/**
 * Add Signature to a VC ID
 * @param {String} vcId
 * @param {String} sign
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function addSign(
  vcId,
  sign,
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
 * @param {String} vcHex
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function storeVC(
  vcHex, 
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
 * @param {String} status
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function updateStatus(
  vcId,
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

export {
    getVCIdsByDID,
    getDIDByVCId,
    getVCs,
    getVCApprovers,
    getVCHistoryByVCId,
    addSign,
    storeVC,
    updateStatus,    
};