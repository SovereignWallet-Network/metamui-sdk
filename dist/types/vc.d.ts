import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";
import { AnyJson } from "@polkadot/types/types";
/**
 * Encodes Token VC and pads with appropriate bytes
 * @param {Object} TokenVC
 * @param {string} TokenVC.tokenName
 * @param {string} TokenVC.reservableBalance
 * @param {string} TokenVC.decimal
 * @param {string} TokenVC.currencyCode
 * @returns {HexString} Token VC Hex String
 */
declare function createTokenVC({ tokenName, reservableBalance, decimal, currencyCode }: {
    tokenName: any;
    reservableBalance: any;
    decimal: any;
    currencyCode: any;
}): any;
/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} MintSlashVC VC Property
 * @param  {String} MintSlashVC.vcId VC Id
 * @param  {String} MintSlashVC.amount In Highest Form
 * @returns {HexString} Token VC Hex String
 */
declare function createMintSlashVC({ vc_id, currencyCode, amount }: {
    vc_id: any;
    currencyCode: any;
    amount: any;
}): Promise<any>;
/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} vcProperty VC Property
 * @param  {string} vcProperty.vcId VC Id
 * @param  {string} vcProperty.amount In Highest Form
 * @returns {HexString} Token VC Hex String
 */
declare function createTokenTransferVC({ vc_id, currencyCode, amount }: {
    vc_id: any;
    currencyCode: any;
    amount: any;
}): Promise<any>;
/** Encodes Generic VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {string} vcProperty.cid
 * @returns {HexString} Token VC Hex String
 */
declare function createGenericVC({ cid }: {
    cid: any;
}): any;
/**
 * Create Public Did VC
 * @param {Object} publicDidVC
 * @param {string} publicDidVC.public_key
 * @param {string} publicDidVC.registration_number
 * @param {string} publicDidVC.company_name
 * @param {string} publicDidVC.did
 * @returns {HexString} Public Did VC Hex String
 */
declare function createPublicDidVC({ public_key, registration_number, company_name, did }: {
    public_key: any;
    registration_number: any;
    company_name: any;
    did: any;
}): any;
/**
 * Create Private Did VC
 * @param {Object} privateDidVC
 * @param {string} privateDidVC.public_key
 * @param {string} privateDidVC.did
 * @returns {HexString} Private Did VC Hex String
 */
declare function createPrivateDidVC({ public_key, did }: {
    public_key: any;
    did: any;
}): any;
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
declare function generateVC(vcProperty: any, owner: any, issuers: any, vcType: any, sigKeypair: any, ssidUrl?: string): Promise<any>;
/**
 * Lookup a VC
 * @param {HexString} did VC Owner's did
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
declare function getVCIdsByDID(did: string, api: ApiPromise): Promise<AnyJson>;
/**
 * Reverse lookup a VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
declare function getDIDByVCId(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get VCs by VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Object
 */
declare function getVCs(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get VC Approver List from the chain
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC Approver List
 */
declare function getVCApprovers(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get VC History using vcId
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {JSON} VC History
 */
declare function getVCHistoryByVCId(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get Generic vc data
 * @param {string} vcId
 * @param {ApiPromise} api
 * @returns {JSON} Generic VC data
 */
declare function getGenericVCData(vcId: any, ssidUrl: string, api: ApiPromise): Promise<AnyJson>;
/**
 * Verify Generic Vc data
 * @param {string} vcId
 * @param {Object} data
 * @param {ApiPromise} api
 * @returns {Boolean} true if verified
 */
declare function verifyGenericVC(vcId: any, data: any, api: ApiPromise): Promise<boolean>;
/**
* Approve VC
* @param  {HexString} vcID vc_id of VC to be approved
* @param  {KeyringPair} senderAccountKeyPair Issuer Key Ring pair
* @param {ApiPromise} api
* @returns {Object} Transaction Object
*/
declare function approveVC(vcId: HexString, senderAccountKeyPair: KeyringPair, api: ApiPromise, ssidUrl?: string): Promise<any>;
/**
 * Store VC Hex in the chain
 * @param {HexString} vcHex
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function storeVC(vcHex: HexString, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Update Status of a VC ID
 * @param {string} vcId
 * @param {Boolean} vcStatus
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
declare function updateStatus(vcId: HexString, vcStatus: boolean, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/** function that decodes hex of createTokenVC
* @param  {string} hexValue Hex String to be decoded
* @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
* @returns {Object | string} Decoded Object/String
*/
declare function decodeVCProperty(hexValue: any, VCType: any): any;
/** function that decodes hex of createVC where type is TokenVC to it's corresponding object/value
 * @param  {string} hexValue Hex String to be decoded
 * @param  {string} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | string} Decoded Object/String
 */
declare function decodeVC(hexValue: any): any;
/**
 * @param {string} tokenSymbol
 * @param {string} tokenAmount
 * @param {ApiPromise} api
 * @returns {string} Formatted Token Amount
 */
declare function getFormattedTokenAmount(tokenSymbol: string, tokenAmount: string, api: ApiPromise): Promise<string>;
export { createTokenVC, createMintSlashVC, createTokenTransferVC, createGenericVC, createPublicDidVC, createPrivateDidVC, getVCIdsByDID, getDIDByVCId, getVCs, getVCApprovers, getVCHistoryByVCId, getGenericVCData, generateVC, verifyGenericVC, approveVC, storeVC, updateStatus, decodeVC, decodeVCProperty, getFormattedTokenAmount, };
