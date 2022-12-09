import { resolveDIDToAccount } from './did';
import { buildConnection } from './connection';
import { sanitiseDid } from './did';
import { ApiPromise } from '@polkadot/api';
import { submitTransaction } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { encodeData, CURRENCY_CODE_BYTES } from './utils';

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
   let from_did_check = await resolveDIDToAccount(from_did_hex, provider);
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
   let dest_hex = sanitiseDid(dest);
   let dest_check = await resolveDIDToAccount(dest_hex, provider);
   if (!dest_check) {
      throw new Error('DID.DIDNotRegistered');
   }
   const tx = provider.tx.tokens.setBalance(dest_hex, sanitiseCCode(currencyCode), amount);
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
   let dest_did_check = await resolveDIDToAccount(dest_did_hex, provider);
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
   let dest_did_check = await resolveDIDToAccount(dest_did_hex, provider);
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
   let dest_did_check = await resolveDIDToAccount(dest_did_hex, provider);
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
   let to_did_check = await resolveDIDToAccount(to_did_hex, api);
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
 const sanitiseCCode = (token: String): String => {
   if (token.startsWith('0x'))
      return token.padEnd(CURRENCY_CODE_BYTES, '\0');
   return encodeData(token.padEnd(CURRENCY_CODE_BYTES, '\0'), 'currency_code');
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
   sanitiseCCode
};