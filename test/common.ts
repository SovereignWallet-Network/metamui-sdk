import assert from 'assert';
import * as tx from '../src/balances';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

describe('Common works correctly', () => {
  let sigKeypairWithBal: KeyringPair;
  let provider: ApiPromise;
  before(async () => {
    const keyring = await initKeyring();
    const provider = await buildConnection(constants.providerNetwork);
    sigKeypairWithBal = keyring.createFromUri(constants.mnemonicWithBalance);
    await assert.doesNotReject(
        tx.transfer(sigKeypairWithBal, 'did:ssid:alice', 1, provider)
    );
  });

  it('Transaction works correctly with nonce', async () => {
    console.log("Entered 1st Test Case")
    const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
    await assert.doesNotReject(
        tx.transfer(sigKeypairWithBal, 'did:ssid:alice', 1, provider, nonce)
    );
  });

  return true;
});
