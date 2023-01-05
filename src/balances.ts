import { ApiPromise } from '@polkadot/api';
import { buildConnection } from './connection';
import { resolveDIDToAccount, sanitiseDid } from './did';
import { KeyringPair } from '@polkadot/keyring/types';
import { submitTransaction } from './common/helper';

class Subscription {
  private _api: ApiPromise;
  private _did: string;
  private _subscribed: boolean;
  private _detailed: boolean;
  private _decimals: number;

  constructor(api: ApiPromise, did: string, detailed: boolean = false) {
    this._api = api;
    this._did = did;
    this._subscribed = false;
    this._detailed = detailed;
  }

  private async subscribe(callback: (balance: number) => void) {
    if (this._subscribed) {
      return;
    }
    this._subscribed = true;
    if(this._detailed) {
      await this._api.query.token.account(sanitiseDid(this._did), (balance) => {
        if (this._subscribed) {
          console.log(this._did, balance.toJSON()?.['data']);
          callback(balance.toJSON()?.['data']);
        }
      });
    } else {
      await this._api.query.token.account(sanitiseDid(this._did), (balance) => {
        if (this._subscribed) {
          let bal = ( balance.toJSON()?.['data'].free * 1.0 ) / Math.pow(10, this._decimals);
          console.log(this._did, bal);
          callback(bal);
        }
      });
    }
  }

  private unsubscribe() {
    if (!this._subscribed) {
      return;
    }
    this._subscribed = false;
  }

  public async start(callback: (balance: number) => void) {
    console.log('Subscribing to balance', this._did);
    this._decimals = Number( (await this._api.rpc.system.properties()).toHuman()['tokenDecimals'][0] )
    await this.subscribe(callback);
  }

  public async stop() {
    console.log('Unsubscribing to balance', this._did);
    this.unsubscribe();
  }

}

/** Get account balance(Highest Form) based on the did supplied.
* @param {string} did valid registered did
* @param {ApiPromise} api (optional)
* @returns {Number}
*/
const getBalance = async (did: string, api: ApiPromise): Promise<number> => {
  // Resolve the did to get account ID
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || await buildConnection('local');
      const did_hex = sanitiseDid(did);
      const token = await provider.rpc.system.properties();
      const tokenData: any = token.toHuman();
      let decimals = tokenData?.['tokenDecimals'][0];
      // console.log('Decimals', decimals);
      const accountInfo = await provider.query.token.account(did_hex);
      const data = accountInfo.toJSON()?.['data'];
      resolve(data.free / Math.pow(10, decimals));
    } catch (err) {
      // console.log(err);
      return reject(new Error("Cannot get balance"));
    }
  });
};

/** Get account balance(Lowest Form) based on the did supplied.
 * A valid registered did is required
* @param {string} did valid registered did
* @param {ApiPromise} api (optional)
* @returns {Object}
*/
const getDetailedBalance = async (did: string, api: ApiPromise): Promise<Object> => {
  // Resolve the did to get account ID
  return new Promise(async (resolve, reject) => {
    try {
      const provider = api || await buildConnection('local');
      const did_hex = sanitiseDid(did);
      const accountInfo = await provider.query.token.account(did_hex);
      resolve( accountInfo.toJSON()?.['data'] );
    } catch (err) {
      // console.log(err);
      return reject(new Error("Cannot get balance"));
    }
  });
};

/** Listen to balance changes for a DID and execute the callback.
* @param {string} did
* @param {Function} callback
* @param {ApiPromise} api
*/
const subscribeToBalanceChanges = async (did: string, callback: (balance: number) => void, api: ApiPromise) => {
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(did);
    const token = await provider.rpc.system.properties();
    const tokenData: any = token.toHuman();
    let decimals = tokenData?.['tokenDecimals'][0];
    return await provider.query.token.account(did_hex, ({ data: { free: currentBalance } }) => {
      callback(currentBalance.toNumber() / Math.pow(10, decimals));
    });
  } catch (err) {
    return null;
  }
};

/**
 * Subsribe to detailed balance changes for a DID and execute the callback.
 * @param {string} did
 * @param {Function} callback
 * @param {ApiPromise} api
 */
const subscribeToDetailedBalanceChanges = async (did: string, callback: (data: Object) => void, api: ApiPromise) => {
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(did);
    return await provider.query.token.account(did_hex, ({ data }) => {
      callback(data.toJSON());
    });
  } catch (err) {
    return null;
  }
};

/**
 * Get total units of tokens issued in the network.
 * @param {ApiPromise} api
 * @param {Boolean} decimal default value is false. Value is true for decimal form (Highest form) and false for lowest form
 */
async function getTotalSupply(api: ApiPromise, decimal?: Boolean): Promise<Number> {

  const provider = api || (await buildConnection('local'));
  let totalIssuance = Number(await provider.query.balances.totalIssuance());

  if(decimal) {
    const token = await provider.rpc.system.properties();
    const tokenData: any = token.toHuman();
    let decimals = tokenData?.['tokenDecimals'][0];
    totalIssuance = totalIssuance / Math.pow(10, decimals);
  }

  return totalIssuance;
}


/**
 * The function will perform a metamui transfer operation from the account of senderAccount to the
 * receiverDID. The amount is in the lowest form.
 * @param {KeyPair} senderAccountKeyPair
 * @param {string} receiverDID
 * @param {Number} amount In Lowest Form
 * @param {ApiPromise} api (optional)
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
  const provider = api || (await buildConnection('local'));
  // check if the recipent DID is valid
  const receiverAccountID: any = await resolveDIDToAccount(receiverDID, provider);
  // console.log("Receiver Account ID", receiverAccountID);
  if (!receiverAccountID) {
    throw new Error('balances.RecipentDIDNotRegistered');
  }

  const tx = provider.tx.balances.transfer({ Id: receiverAccountID }, amount);
  if(nonce === undefined){
    nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  }
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * This function is similar to sendTransaction except that it provides the user to add the memo to transfer functionality.
 * 
 * @param {KeyPair} senderAccountKeyPair
 * @param {string} receiverDID
 * @param {Number} amount In Lowest Form
 * @param {string} memo
 * @param {ApiPromise} api
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
  const provider = api || (await buildConnection('local'));
  // check if the recipent DID is valid
  const receiverAccountID:any = await resolveDIDToAccount(receiverDID, provider);
  // console.log("Receiver Account ID", receiverAccountID);
  if (!receiverAccountID) {
    throw(new Error('balances.RecipentDIDNotRegistered'));
  }
  const tx = provider.tx.balances
    .transferWithMemo({ id: receiverAccountID }, amount, memo);
  if(nonce === undefined){
    nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
  }
  const signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

export {
  getBalance,
  getDetailedBalance,
  subscribeToBalanceChanges,
  subscribeToDetailedBalanceChanges,
  getTotalSupply,
  transfer,
  transferWithMemo,
  Subscription
};
