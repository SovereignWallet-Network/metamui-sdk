 import { resolveDIDToAccount } from './did';
 import { buildConnection } from './connection';
 import { sanitiseDid } from './did';
 import { ApiPromise } from '@polkadot/api';
 import { submitTransaction } from './common/helper';
 import { KeyringPair } from '@polkadot/keyring/types';

 
 /**
  * Mint token to given currency
  * @param {String} vcId
  * @param {KeyringPair} senderAccountKeyPair
  * @param {APIPromise} api
  * @returns {hexString}
  */
  async function mintToken(
    vcId,
    senderAccountKeyPair: KeyringPair,
    api: ApiPromise,
  ) {
     const provider = api || (await buildConnection('local'));
     const tx = provider.tx.token.mintToken(vcId);
     let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
     let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
     return submitTransaction(signedTx, provider);
  }
 
 /**
  * Slash token from given currency
  * @param {String} vcId
  * @param {KeyringPair} senderAccountKeyPair
  * @param {APIPromise} api
  * @returns {hexString}
  */
 async function slashToken(
   vcId,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
 ) {
    const provider = api || (await buildConnection('local'));
    const tx = provider.tx.token.slashToken(vcId);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
 }
 
/**
 * Transfer tokens to a DID
 * @param {String} vcId
 * @param {String} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
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
        throw new Error('token.RecipentDIDNotRegistered');
    }
    const provider = api || (await buildConnection('local'));
    const tx = provider.tx.token.transferToken(vcId, to_did_hex);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

/**
 * Withdraw Reserved tokens from one DID to another DID
 * @param {String} toDid
 * @param {String} fromDid
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {APIPromise} api
 * @returns {hexString}
 */
async function withdrawReserved(
    toDid,
    fromDid,
    amount,
    senderAccountKeyPair: KeyringPair,
    api: ApiPromise,
    ) {

    let [to_account_id, from_account_id] = await Promise.all([
        resolveDIDToAccount(
            sanitiseDid(toDid), 
            api
        ), 
        resolveDIDToAccount(
            sanitiseDid(fromDid), 
            api
        )
    ]);
    if (!to_account_id) {
        throw new Error('token.RecipentDIDNotRegistered');
    }
    if (!from_account_id) {
        throw new Error('token.SenderDIDNotRegistered');
    }

    const provider = api || (await buildConnection('local'));
    const tx = provider.tx.token.withdrawReserved(sanitiseDid(toDid), sanitiseDid(fromDid), amount);
    let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
    let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

 export {
    mintToken,
    slashToken,
    transferToken,
    withdrawReserved
 };