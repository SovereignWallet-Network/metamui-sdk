import { ApiPromise } from '@polkadot/api';
import { buildConnection } from './connection';
import { sanitiseDid } from './did';
import { KeyringPair } from '@polkadot/keyring/types';
import { submitTransaction } from './common/helper';
import { utils } from '.';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';

/**
 * Add Allowed Extrinsics
 * @param {string} palletName
 * @param {string} functionName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
 async function addAllowedExtrinsic(palletName: string, functionName: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.checkAccess.addAllowedExtrinsic(sanitiseInput(palletName), sanitiseInput(functionName));
  const nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Remove Allowed Extrinsics
 * @param {string} palletName
 * @param {string} functionName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
 async function removeAllowedExtrinsic(palletName: string, functionName: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.checkAccess.removeAllowedExtrinsic(sanitiseInput(palletName), sanitiseInput(functionName));
  const nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Add Blacklisted Did
 * @param {string} did
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @param {number} reasonCode OPTIONAL
 * @returns {Promise<any>} Transaction object
 */
 async function addBlacklistedDid(did: string, senderAccountKeyPair: KeyringPair, api: ApiPromise, reasonCode?: number): Promise<any> {
  const provider = api || await buildConnection('local');
  let tx: SubmittableExtrinsic<"promise", ISubmittableResult>;
  if(!reasonCode)
    tx = provider.tx.checkAccess.addBlacklistedDid(sanitiseDid(did));
  else
    tx = provider.tx.checkAccess.addBlacklistedDid(sanitiseDid(did), reasonCode);
  const nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Add Blacklisted Did
 * @param {string} did
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
async function removeBlacklistedDid(did: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  let tx = provider.tx.checkAccess.removeBlacklistedDid(sanitiseDid(did));
  const nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Add Blacklisting Reason
 * @param {string} reasonName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
 async function addBlacklistingReason(reasonName: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  let tx = provider.tx.checkAccess.addBlacklistingReason(sanitiseInput(reasonName));
  const nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Remove Blacklisting Reason
 * @param {number} reasonCode
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
 async function removeBlacklistingReason(reasonCode: number, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  let tx = provider.tx.checkAccess.removeBlacklistingReason(reasonCode);
  const nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Sanitise input
 * @param {string} input
 * @return {string} Hex data
 */
const sanitiseInput = (input: string) => {
  if (input.startsWith('0x'))
    return input.padEnd(32, '\0');
  return utils.encodeData(input.padEnd(32, '\0'), 'Input32Bytes') as string;
}

/**
 * Get all blacklisted dids with reasons
 * @param {ApiPromise} api
 */
 async function getBlacklistedDids(api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  const blacklistedDids = await provider.query.checkAccess.blacklistedDids.entries();
  if(!blacklistedDids) return null;
  return blacklistedDids.map((did) => {
    return {
      did: did[0].toHuman(),
      reason: did[1].toHuman()
    }
  });
}

/**
 * Get reason for blacklisted did
 * @param {string} did
 * @param {ApiPromise} api
 */
 async function getBlacklistingReasonOfDid(did: string, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  const reason = await provider.query.checkAccess.blacklistedDids(sanitiseDid(did));
  if(!reason) return null;
  return reason.toJSON();
}

/**
 * Get blacklisting reson from reason code
 * @param {number} reasonCode
 * @param {ApiPromise} api
 * @returns Blacklisting reason
 */
 async function getBlacklistingReasonFromCode(reasonCode: number, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  const reason = await provider.query.checkAccess.blacklistingReasons(reasonCode);
  if(!reason) return null;
  return reason.toJSON();
}

/**
 * Reverse lookup for blacklisting reason code
 * @param {string} reasonName
 * @param {ApiPromise} api
 * @returns Blacklisting reason code
 */
 async function getBlacklistingReasonCode(reasonName: string, api: ApiPromise): Promise<any> {
  const provider = api || await buildConnection('local');
  const reasonCode = await provider.query.checkAccess.blacklistingReasonsRLookup(sanitiseInput(reasonName));
  if(!reasonCode) return null;
  return reasonCode.toJSON();
}

export {
  addAllowedExtrinsic,
  removeAllowedExtrinsic,
  addBlacklistedDid,
  removeBlacklistedDid,
  addBlacklistingReason,
  removeBlacklistingReason,
  sanitiseInput,
  getBlacklistedDids,
  getBlacklistingReasonOfDid,
  getBlacklistingReasonFromCode,
  getBlacklistingReasonCode,
};