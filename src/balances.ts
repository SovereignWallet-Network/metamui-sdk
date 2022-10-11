import { ApiPromise, Keyring } from '@polkadot/api';
import { buildConnection } from './connection';
import { resolveDIDToAccount, sanitiseDid } from './did';
import { KeyringPair } from '@polkadot/keyring/types';
import { submitTransaction } from './common/helper';

/** Get account balance(Highest Form) based on the did supplied.
* @param {String} did
*/
const getBalance = async (did: string, api?: ApiPromise): Promise<number> => {
  // Resolve the did to get account ID
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || await buildConnection('local');
      const did_hex = sanitiseDid(did);
      const accountInfo = await provider.query.mui.account(did_hex);
      const data = accountInfo.toJSON()?.['data'];
      resolve(data.free / 1e6);
    } catch (err) {
      // console.log(err);
      return reject(new Error("Cannot get balance"));
    }
  });
};

/** Listen to balance changes for a DID and execute the callback.
* @param {String} identifier
*/
const subscribeToBalanceChanges = async (identifier: string, callback: (balance: number) => void, api: ApiPromise) => {
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(identifier);
    return await provider.query.mui.account(did_hex, ({ data: { free: currentBalance } }) => {
      callback(currentBalance.toNumber() / 1e6);
    });
  } catch (err) {
    return null;
  }
};


/**
 * The function will perform a metamui transfer operation from the account of senderAccount to the
 * receiverDID.
 * Note : balanceCheck has not been included in the checks since sender not having balance
 * is handled in extrinsic, check test/balances.js
 * @param {KeyPair} senderAccountKeyPair
 * @param {String} receiverDID
 * @param {String} amount In Lowest Form
 * @param {APIPromise} api (optional)
 * @param {int} nonce (optional)
 * @returns {Uint8Array}
 */
async function transfer(
  senderAccountKeyPair: KeyringPair,
  receiverDID: string,
  amount: number,
  api: ApiPromise,
  nonce?: any,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || (await buildConnection('local'));
      // check if the recipent DID is valid
      const receiverAccountID: any = await resolveDIDToAccount(receiverDID, provider);
      // console.log("Receiver Account ID", receiverAccountID);
      if (!receiverAccountID) {
        return reject(new Error('balances.RecipentDIDNotRegistered'));
      }

      const tx = provider.tx.balances.transfer({ Id: receiverAccountID }, amount);
      if(nonce === undefined){
        nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
      }
      const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
      // await signedTx.send(function ({ status, dispatchError }) {
      //   // console.log('Transaction status:', status.type);
      //   if (dispatchError) {
      //     // console.log(JSON.stringify(dispatchError.toHuman()));
      //     if (dispatchError.isModule) {
      //       // for module errors, we have the section indexed, lookup
      //       const decoded = api.registry.findMetaError(dispatchError.asModule);
      //       const { docs, index, section, name } = decoded;
      //       // console.log(`${section}.${name}: ${docs.join(' ')}`);
      //       return reject(new Error(`${section}.${name}`));
      //       // console.log(decoded);
      //       // reject(new Error(decoded?.toString()));
      //     } else {
      //       // Other, CannotLookup, BadOrigin, no extra info
      //       // console.log(dispatchError.toString());
      //       return reject(new Error(dispatchError.toString()));
      //     }
      //   } else if (status.isFinalized) {
      //     // console.log('Finalized block hash', status.asFinalized.toHex());
      //     resolve(signedTx.hash.toHex())
      //   }
      // });
      return submitTransaction(signedTx, provider);
    } catch (err) {
      // console.log(err);
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
async function transferWithMemo(
  senderAccountKeyPair: KeyringPair,
  receiverDID: string,
  amount: number,
  memo: string,
  api: ApiPromise,
  nonce?: any,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || (await buildConnection('local'));
      // check if the recipent DID is valid
      const receiverAccountID:any = await resolveDIDToAccount(receiverDID, provider);
      // console.log("Receiver Account ID", receiverAccountID);
      if (!receiverAccountID) {
        return reject(new Error('balances.RecipentDIDNotRegistered'));
      }
      const tx = provider.tx.balances
        .transferWithMemo({ id: receiverAccountID }, amount, memo);
      if(nonce === undefined){
        nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
      }
      const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
      await signedTx.send(function ({ status, dispatchError }) {
        // console.log('Transaction status:', status.type);
        if (dispatchError) {
          // console.log(JSON.stringify(dispatchError.toHuman()));
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, index, section, name } = decoded;
            // console.log(`${section}.${name}: ${docs.join(' ')}`);
            return reject(new Error(`${section}.${name}`));
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            // console.log(dispatchError.toString());
            return reject(new Error(dispatchError.toString()));
          }
        } else if (status.isFinalized) {
          // console.log('Finalized block hash', status.asFinalized.toHex());
          resolve(signedTx.hash.toHex());
        }
      });
      // submitTransaction(signedTx, provider);
    } catch (err) {
      // console.log(err);
      return reject(err);
    }
  });
}

export {
  getBalance,
  subscribeToBalanceChanges,
  transfer,
  transferWithMemo
};
