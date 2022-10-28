import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { HexString } from "@polkadot/util/types";
import { AnyJson, AnyString } from "@polkadot/types/types";
/**
 * Encodes Token VC and pads with appropriate bytes
 * @param {Object} TokenVC
 * @param {String} TokenVC.tokenName
 * @param {String} TokenVC.reservableBalance
 * @param {String} TokenVC.decimal
 * @param {String} TokenVC.currencyCode
 * @returns {HexString} Token VC Hex String
 */
declare function createTokenVC({ tokenName, reservableBalance, decimal, currencyCode }: {
    tokenName: any;
    reservableBalance: any;
    decimal: any;
    currencyCode: any;
}): any;
/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} MintSlashVC
 * @param  {String} MintSlashVC.vcId
 * @param  {String} MintSlashVC.currencyCode
 * @param  {String} MintSlashVC.amount In Highest Form
 * @returns {String} Token VC Hex String
 */
declare function createMintSlashVC({ vc_id, amount }: {
    vc_id: any;
    amount: any;
}): Promise<any>;
/** Encodes Token VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {String} vcProperty.vcId
 * @param  {String} vcProperty.vcId
 * @param  {String} vcProperty.vcId
 * @param  {String} vcProperty.currencyCode
 * @param  {String} vcProperty.amount In Highest Form
 * @returns {String} Token VC Hex String
 */
declare function createTokenTransferVC({ vc_id, amount }: {
    vc_id: any;
    amount: any;
}): Promise<any>;
/** Encodes Generic VC and pads with appropriate bytes
 * @param  {Object} vcProperty
 * @param  {String} vcProperty.cid
 * @returns {HexString} Token VC Hex String
 */
declare function createGenericVC({ cid }: {
    cid: any;
}): any;
/**
 * Create Public Did VC
 * @param {Object} publicDidVC
 * @param {String} publicDidVC.public_key
 * @param {String} publicDidVC.did
 * @param {String} publicDidVC.registration_number
 * @param {String} publicDidVC.company_name
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
 * @param {String} privateDidVC.public_key
 * @param {String} privateDidVC.did
 * @returns {HexString} Private Did VC Hex String
 */
declare function createPrivateDidVC({ public_key, did }: {
    public_key: any;
    did: any;
}): any;
/**
 * Create VC
 * @param  {Object} vcProperty
 * @param  {String} owner Did
 * @param  {String[]} issuers Array of Did
 * @param  {String} vcType TokenVC, MintTokens, SlashTokens, TokenTransferVC, GenericVC
 * @param  {KeyPair} sigKeypair Owner Key Ring pair
 * @returns {String} VC Hex String
 */
declare function generateVC(vcProperty: any, owner: any, issuers: any, vcType: any, sigKeypair: any, api?: ApiPromise, ssidUrl?: string): Promise<any>;
/**
 * Lookup a VC
 * @param {AnyString} did VC Owner's did
 * @param {ApiPromise} api
 */
declare function getVCIdsByDID(did: AnyString, api: ApiPromise): Promise<AnyJson>;
/**
 * Reverse lookup a VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
declare function getDIDByVCId(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get VCs by VC ID
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
declare function getVCs(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get VC Approver List from the chain
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
declare function getVCApprovers(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get VC History using vcId
 * @param {HexString} vcId
 * @param {ApiPromise} api
 * @returns {String}
 */
declare function getVCHistoryByVCId(vcId: HexString, api: ApiPromise): Promise<AnyJson>;
/**
 * Get Generic vc data
 * @param {String} vcId
 * @param {ApiPromise} api
 * @returns Generic VC data
 */
declare function getGenericVCData(vcId: any, ssidUrl: string, api: ApiPromise): Promise<AnyJson>;
/**
 * Verify Generic Vc data
 * @param {String} vcId
 * @param {Object} data
 * @param {ApiPromise} api
 * @returns {Boolean} true if verified
 */
declare function verifyGenericVC(vcId: any, data: any, api: ApiPromise): Promise<boolean>;
/**
* Approve VC
* @param  {HexString} vcID vc_id of VC to be approved
* @param  {KeyPair} senderAccountKeyPair Issuer Key Ring pair
* @param {APIPromise} api
* @returns {String} Transaction hash or Error
*/
declare function approveVC(vcId: HexString, senderAccountKeyPair: KeyringPair, api: ApiPromise, ssidUrl?: string): Promise<any>;
/**
 * Store VC Hex in the chain
 * @param {HexString} vcHex
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {hexString}
 */
declare function storeVC(vcHex: HexString, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Update Status of a VC ID
 * @param {String} vcId
 * @param {Boolean} vcStatus
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
declare function updateStatus(vcId: HexString, vcStatus: boolean, senderAccountKeyPair: KeyringPair, api: ApiPromise): Promise<any>;
/** function that decodes hex of createTokenVC
* @param  {String} hexValue Hex String to be decoded
* @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
* @returns {Object | String} Decoded Object/String
*/
declare function getVCProperty(hexValue: any, VCType: any): any;
/** function that decodes hex of createVC where type is TokenVC to it's corresponding object/value
 * @param  {String} hexValue Hex String to be decoded
 * @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | String} Decoded Object/String
 */
declare function decodeVC(hexValue: any, VCType: any): any;
declare function getFormattedTokenAmount(tokenSymbol: string, tokenAmount: string, api: ApiPromise): Promise<string>;
export { createTokenVC, createMintSlashVC, createTokenTransferVC, createGenericVC, createPublicDidVC, createPrivateDidVC, getVCIdsByDID, getDIDByVCId, getVCs, getVCApprovers, getVCHistoryByVCId, getGenericVCData, generateVC, verifyGenericVC, approveVC, storeVC, updateStatus, decodeVC, getVCProperty, getFormattedTokenAmount, };
