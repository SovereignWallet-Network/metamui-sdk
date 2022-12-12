import { buildConnection } from './connection';
import { sanitiseDid } from './did';
import { ApiPromise } from '@polkadot/api';
import { submitTransaction } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { encodeData, CURRENCY_CODE_BYTES } from './utils';
import { did } from '.';

// Extrinsic functions

/**
 * Issue a new currency
 * @param {HexString} vcId
 * @param {Number} totalSupply
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function issueToken(
    vcId,
    totalSupply,
    senderAccountKeyPair: KeyringPair,
    api: ApiPromise,
 ) {
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.issueToken(vcId, totalSupply);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function mintToken(
   vcId,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
 ) {
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.mintToken(vcId);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Remove Token from circulation
 * @param {String} currencyCode
 * @param {HexString} vcId
 * @param {String} fromDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function removeToken(
  currencyCode,
  vcId,
  fromDid,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
   const provider = api || (await buildConnection('local'));
   let from_did_hex = sanitiseDid(fromDid);
   let from_did_check = await did.resolveDIDToAccount(from_did_hex, provider);
   if (!from_did_check) {
        throw new Error('DID.DIDNotRegistered');
   }
   const tx = provider.tx.tokens.removeToken(currencyCode, vcId, from_did_hex);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Set Balance of a DID of a given currency
 * @param {String} dest
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
  async function setBalance(
   dest,
   currencyCode,
   amount,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(dest);
   let dest_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_check) {
      throw new Error('DID.DIDNotRegistered');
   }
   const tx = provider.tx.tokens.setBalance(dest_did_hex, sanitiseCCode(currencyCode), amount);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function slashToken(
  vcId,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.slashToken(vcId);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transfer(
   destDid,
   currencyCode,
   amount,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(destDid);
   let dest_did_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_did_check) {
      throw new Error('DID.RecipentDIDNotRegistered');
   }
   const tx = provider.tx.tokens.transfer(dest_did_hex, sanitiseCCode(currencyCode), amount);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer all token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transferAll(
   destDid,
   currencyCode,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(destDid);
   let dest_did_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_did_check) {
      throw new Error('DID.RecipentDIDNotRegistered');
   }
   const tx = provider.tx.tokens.transferAll(dest_did_hex, sanitiseCCode(currencyCode));
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {String} memo
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transferTokenWithMemo(
   destDid,
   currencyCode,
   amount,
   memo,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(destDid);
   let dest_did_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_did_check) {
      throw new Error('DID.RecipentDIDNotRegistered');
   }
   const tx = provider.tx.tokens.transfer(dest_did_hex, sanitiseCCode(currencyCode), amount, memo);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {string} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transferToken(
   vcId,
   toDid,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
   ) {

   let to_did_hex = sanitiseDid(toDid);
   let to_did_check = await did.resolveDIDToAccount(to_did_hex, api);
   if (!to_did_check) {
       throw new Error('DID.RecipentDIDNotRegistered');
   }
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.transferToken(vcId, to_did_hex);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
 const sanitiseCCode = (token) => {
   if(!token) return null;
   if (token.startsWith('0x'))
      return token.padEnd(CURRENCY_CODE_BYTES, '\0');
   return encodeData(token.padEnd(CURRENCY_CODE_BYTES, '\0'), 'currency_code');
}

// Storage Query Functions

/**
 * Get the token balance of an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
 async function accounts(
   currencyCode: String,
   did: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.accounts(sanitiseCCode(currencyCode), sanitiseDid(did))).toJSON();
}

/**
 * Get any liquidity locks of a token type under an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
 async function locks(
   currencyCode: String,
   did: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.locks(sanitiseCCode(currencyCode), sanitiseDid(did))).toJSON();
}

/**
 * Storage map between currency code and block number 
 * @param {ApiPromise} api
 * @param {String} currencyCode (Optional)
 */
 async function removedTokens(
   api: ApiPromise,
   currencyCode?: String,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.removedTokens(sanitiseCCode(currencyCode))).toJSON();
}

/**
 * Token currency counter
 * @param {ApiPromise} api
 */
 async function tokenCurrencyCounter(
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenCurrencyCounter()).toString();
}

/**
 * Map to store a friendly token name for token
 * @param {String} currencyCode
 * @param {ApiPromise} api
 */
 async function tokenData(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenData(sanitiseCCode(currencyCode))).toJSON();
}

/**
 * Get Token Information
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Currency Id
 */
async function tokenInfo(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenInfo(sanitiseCCode(currencyCode))).toString();
}

/**
 * Reverse lookup Token Information
 * @param {Number} currencyId
 * @param {ApiPromise} api
 * @returns {HexString} Currency Code Hex
 */
 async function tokenInfoRLookup(
   currencyId: Number,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenInfoRLookup(currencyId)).toHex();
}

/**
 * Lookup Token Issuer
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {HexString} Token Owner DID Hex
 */
 async function tokenIssuer(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenIssuer(sanitiseCCode(currencyCode))).toHex();
}

/**
 * Get Total Token Issuance
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Token Issuance
 */
async function totalIssuance(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.totalIssuance(sanitiseCCode(currencyCode))).toString();
}

export {
   issueToken,
   mintToken,
   removeToken,
   setBalance,
   slashToken,
   transfer,
   transferAll,
   transferTokenWithMemo,
   transferToken,
   sanitiseCCode,
   accounts,
   locks,
   removedTokens,
   tokenCurrencyCounter,
   tokenData,
   tokenInfo,
   tokenInfoRLookup,
   tokenIssuer,
   totalIssuance
};