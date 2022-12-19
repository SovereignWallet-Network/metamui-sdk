import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/**
 * Add Allowed Extrinsics
 * @param {string} palletName
 * @param {string} functionName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
declare function addAllowedExtrinsic(palletName: string, functionName: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Remove Allowed Extrinsics
 * @param {string} palletName
 * @param {string} functionName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
declare function removeAllowedExtrinsic(palletName: string, functionName: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Add Blacklisted Did
 * @param {string} did
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @param {number} reasonCode OPTIONAL
 * @returns {Promise<any>} Transaction object
 */
declare function addBlacklistedDid(did: string, senderAccountKeyPair: KeyringPair, api: ApiPromise, reasonCode?: number): Promise<any>;
/**
 * Add Blacklisted Did
 * @param {string} did
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
declare function removeBlacklistedDid(did: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Add Blacklisting Reason
 * @param {string} reasonName
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
declare function addBlacklistingReason(reasonName: string, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Remove Blacklisting Reason
 * @param {number} reasonCode
 * @param {ApiPromise} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Promise<any>} Transaction object
 */
declare function removeBlacklistingReason(reasonCode: number, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Sanitise input
 * @param {string} input
 * @return {string} Hex data
 */
declare const sanitiseInput: (input: string) => string;
/**
 * Get all blacklisted dids with reasons
 * @param {ApiPromise} api
 */
declare function getBlacklistedDids(api: ApiPromise): Promise<any>;
/**
 * Get reason for blacklisted did
 * @param {string} did
 * @param {ApiPromise} api
 */
declare function getBlacklistingReasonOfDid(did: string, api: ApiPromise): Promise<any>;
/**
 * Get blacklisting reson from reason code
 * @param {number} reasonCode
 * @param {ApiPromise} api
 * @returns Blacklisting reason
 */
declare function getBlacklistingReasonFromCode(reasonCode: number, api: ApiPromise): Promise<any>;
/**
 * Reverse lookup for blacklisting reason code
 * @param {string} reasonName
 * @param {ApiPromise} api
 * @returns Blacklisting reason code
 */
declare function getBlacklistingReasonCode(reasonName: string, api: ApiPromise): Promise<any>;
export { addAllowedExtrinsic, removeAllowedExtrinsic, addBlacklistedDid, removeBlacklistedDid, addBlacklistingReason, removeBlacklistingReason, sanitiseInput, getBlacklistedDids, getBlacklistingReasonOfDid, getBlacklistingReasonFromCode, getBlacklistingReasonCode, };
