import { buildConnection } from './connection.js';
import { sanitiseDid } from './did.js';

/**
 * Get account balance(Highest Form) based on the did supplied.
 * @param {String} did Identifier of the user
 * @param {ApiPromse=} api Api Object from Build Connection
 * @returns {String} Balance In Highest Form
 * @example await getBalanceFromDID(did, api)
 */
export const getBalance = async (did: any, api = false) => {
  // Resolve the did to get account ID
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(did);
    const accountInfo = await provider.query.did.account(did_hex);
    const { data } = accountInfo.toJSON();
    return data.free / 1e6;
  } catch (err) {
    // console.log(err);
    return 0;
  }
};
/**
 * Listen to balance changes for a DID and execute the callback.
 * @param {String} identifier DID
 * @param {Function} callback Cb function to execute with new balance in Highest Form
 * @param {ApiPromise=} api Api Object from Build Connection
 */
export const subscribeToBalanceChanges = async (identifier: any, callback: (arg0: number) => void, api: any = false) => {
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(identifier);
    return provider.query.did.account(did_hex, ({ data: { free: currentBalance } }) => {
        callback(currentBalance.toNumber() / 1e6);
      });
  } catch (err) {
    return null;
  }
};

module.exports = {
  getBalance,
  subscribeToBalanceChanges,
};
