import { ApiPromise } from '@polkadot/api';
import { buildConnection } from './connection';
import { sanitiseDid } from './did';

// Get account balance(Highest Form) based on the did supplied.

const getBalance = async (did: string, api?: ApiPromise): Promise<number> => {
  // Resolve the did to get account ID
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(did);
    const accountInfo = await provider.query.did.account(did_hex);
    const data = accountInfo.toJSON()?.['data'];
    return data.free / 1e6;
  } catch (err) {
    // console.log(err);
    return 0;
  }
};

// * Listen to balance changes for a DID and execute the callback.

const subscribeToBalanceChanges = async (identifier: string, callback: (arg0: number) => void, api: any = false) => {
  try {
    const provider = api || await buildConnection('local');
    const did_hex = sanitiseDid(identifier);
    return provider.query.mui.account(did_hex, ({ data: { free: currentBalance } }) => {
      callback(currentBalance.toNumber() / 1e6);
    });
  } catch (err) {
    return null;
  }
};

export { getBalance, subscribeToBalanceChanges };