import assert from 'assert';
import * as tx from '../src/balances';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { balances } from '../src';

describe('Balances works correctly', () => {
  let sigKeypairWithBal: KeyringPair;
  let sigKeypairWithoutBal: KeyringPair;
  let provider: ApiPromise;
  before(async () => {
    const keyring = await initKeyring();
    provider = await buildConnection(constants.providerNetwork, true);
    sigKeypairWithBal = keyring.createFromUri(constants.mnemonicWithBalance);
    sigKeypairWithoutBal = keyring.createFromUri('//Dave');
  });

  it('getBalance works correctly', async () => {
    const balanceAmount: number = await balances.getBalance('did:ssid:swn', provider);
    assert.strictEqual(Math.floor(balanceAmount) >= 0, true);
  });

  it('subscribeToBalanceChanges works correctly', (done) => {
    let isCallbackCalled = false;
    balances.subscribeToBalanceChanges('did:ssid:swn', (balanceAmount) => {
      // console.log('Awaiting balance succesfull: ', balanceAmount);
      if (isCallbackCalled) return;
      isCallbackCalled = true;
      assert.strictEqual(Math.floor(balanceAmount) >= 0, true);
      done();
    }, provider);
  });

  it('Get Total Supply Works correctly', async () => {
    const totalSupply = await balances.getTotalSupply(provider);
    // console.log(totalSupply);
    assert.notEqual(totalSupply, null);
  });

  it('Get Detailed Balance Works correctly', async () => {
    const detailedBalance = await balances.getDetailedBalance("did:ssid:swn", provider);
    // console.log("Awaiting detailed balance successful: ", detailedBalance);
    assert.notEqual(detailedBalance, null);
  });

  it('Subscribe to get detailed Balance Works correctly', async () => {
    return await balances.subscribeToDetailedBalanceChanges("did:ssid:swn", (data) => {
      // console.log(data);
    }, provider);
  });

  if (constants.providerNetwork == 'local') { 
    it('Transaction works correctly with nonce', async () => {
      const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
      const transfer = tx.transfer(sigKeypairWithBal, 'did:ssid:alice', 1, provider, nonce);
      await assert.doesNotReject(transfer);
    });

    it('Transaction throws error for unregistered DID', async () => {
      const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
      const transfer = tx.transfer(sigKeypairWithBal, 'did:ssid:nonexistentdid', 1, provider, nonce);
      await assert.rejects(transfer, (err: { message: any; }) => {  
        assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
        return true;
      });
    });

    it('Transaction fails when sender has no balance', async () => {
        await assert.rejects(tx.transfer(sigKeypairWithoutBal, 'did:ssid:alice', 1, provider), (err: {message : any;}) => {
          assert.strictEqual(err.message, 'balances.InsufficientBalance');
          return true;
        });
    });

    it('Transaction fails when recipent has no DID', async () => {
      const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address)
      await assert.rejects(tx.transfer(sigKeypairWithBal, 'Bob123', 1, provider, nonce), (err: { message: any; }) => {
        assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
        return true;
      });
    });

    it('Transaction with Memo works correctly with nonce', async () => {
      const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
      const transfer = tx.transferWithMemo(sigKeypairWithBal, 'did:ssid:alice', 1, 'Memo Test', provider, nonce);
      await assert.doesNotReject(transfer);
    });

    it('Transaction with Memo throws error for unregistered DID', async () => {
      const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal?.address);
      const transfer = tx.transferWithMemo(sigKeypairWithBal, 'did:ssid:nonexistentdid', 1, 'Memo Test', provider, nonce);
      await assert.rejects(transfer, (err: { message: any; }) => {
        assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
        return true;
      });
    });
  }

  return true;
});
