import { ApiPromise, Keyring } from '@polkadot/api';
import { AnyJson } from '@polkadot/types/types';
import { buildConnection } from './connection';
import { resolveDIDToAccount } from './did';
import { KeyringPair } from '@polkadot/keyring/types';

/**
 * The function will perform a metamui transfer operation from the account of senderAccount to the
 * receiverDID.
 * Note : balanceCheck has not been included in the checks since sender not having balance
 * is handled in extrinsic, check test/transaction.js
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {String} amount In Lowest Form
 * @param {APIPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
async function sendTransaction(
  senderAccountKeyPair: KeyringPair,
  receiverDID: string,
  amount: number,
  api: ApiPromise | null = null,
  nonce: any = false,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || (await buildConnection('local'));
      // check if the recipent DID is valid
      const receiverAccountID: number = await resolveDIDToAccount(receiverDID, provider);
      if (!receiverAccountID) {
        throw new Error('balances.RecipentDIDNotRegistered');
      }

      const tx = provider.tx.balances.transfer({ Id: receiverAccountID }, amount);
      nonce = nonce || await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
      // console.log((await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address)));
      const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
      await signedTx.send(function ({ status, dispatchError }) {
        console.log('Transaction status:', status.type);
        if (dispatchError) {
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api?.registry.findMetaError(dispatchError.asModule);
            const { docs, index, section, name } = decoded;
            console.log(`${section}.${name}: ${docs.join(' ')}`);
            reject(new Error(`${section}.${name}`));
            // console.log(decoded);
            // reject(new Error(decoded?.toString()));
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            // console.log(dispatchError.toString());
            reject(new Error(dispatchError.toString()));
          }
        } else if (status.isFinalized) {
          // console.log('Finalized block hash', status.asFinalized.toHex());
          resolve(signedTx.hash.toHex())
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

/**
 * This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.
 * 
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {String} amount In Lowest Form
 * @param {String} memo
 * @param {APIPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
async function transfer(
  senderAccountKeyPair: KeyringPair,
  receiverDID: string,
  amount: number,
  memo: string,
  api: ApiPromise | null = null,
  nonce: any = false,
) {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || (await buildConnection('local'));
      // check if the recipent DID is valid
      const receiverAccountID: number = await resolveDIDToAccount(receiverDID, provider);
      if (!receiverAccountID) {
        throw new Error('balances.RecipentDIDNotRegistered');
      }
      const tx = provider.tx.balances
        .transferWithMemo({ id: receiverAccountID }, amount, memo);
      nonce = nonce || await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
      const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
      await signedTx.send(function ({ status, dispatchError }) {
        console.log('Transaction status:', status.type);
        if (dispatchError) {
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api?.registry.findMetaError(dispatchError.asModule);
            // const { documentation, name, section } = decoded;
            // console.log(`${section}.${name}: ${documentation.join(' ')}`);
            // reject(new Error(`${section}.${name}`));
            reject(new Error(decoded?.toString()));
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            // console.log(dispatchError.toString());
            reject(new Error(dispatchError.toString()));
          }
        } else if (status.isFinalized) {
          // console.log('Finalized block hash', status.asFinalized.toHex());
          resolve(signedTx.hash.toHex());
        }
      });
    } catch (err) {
      // console.log(err);
      reject(err);
    }
  });
}

export {
  sendTransaction,
  transfer
};
