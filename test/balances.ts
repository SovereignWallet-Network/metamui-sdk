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
    const provider = await buildConnection(constants.providerNetwork);
    sigKeypairWithBal = keyring.createFromUri(constants.mnemonicWithBalance);
    sigKeypairWithoutBal = keyring.createFromUri('//Dave');
    const transfer = tx.transfer(sigKeypairWithBal, 'did:ssid:alice', 1, provider);
    await assert.doesNotReject(transfer);
  });

  it('getBalance works correctly', async () => {
    const balanceAmount: number = await balances.getBalance('did:ssid:swn', provider);
    assert.strictEqual(Math.floor(balanceAmount) >= 0, true);
  });

  it('subscribeToBalanceChanges works correctly', (done) => {
    let isCallbackCalled = false;
    balances.subscribeToBalanceChanges('did:ssid:swn', (balanceAmount) => {
      console.log('Awaiting balance succesfull: ', balanceAmount);
      if (isCallbackCalled) return;
      isCallbackCalled = true;
      assert.strictEqual(Math.floor(balanceAmount) >= 0, true);
      done();
    }, provider);
  });

  it('Transaction works correctly with nonce', async () => {
    const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
    const transfer = tx.transfer(sigKeypairWithBal, 'did:ssid:alice', 1, provider, nonce);
    await assert.doesNotReject(transfer);
  });

  it('Transaction throws error for unregistered DID', async () => {
    const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
    const transfer = tx.transfer(sigKeypairWithBal, 'did:ssid:nonexistentdid', 1, provider, nonce);
    await assert.rejects(transfer, (err: { message: any; }) => {  
      assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
      return true;
    });
  });

  it('Transaction fails when sender has no balance', async () => {
    const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
      await assert.rejects(tx.transfer(sigKeypairWithoutBal, 'did:ssid:alice', 1, provider), (err: {message : any;}) => {
        assert.strictEqual(err.message, 'balances.InsufficientBalance');
        return true;
      });
  });

  it('Transaction fails when recipent has no DID', async () => {
    const provider = await buildConnection(constants.providerNetwork);
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address)
    await assert.rejects(tx.transfer(sigKeypairWithBal, 'Bob123', 1, provider, nonce), (err: { message: any; }) => {
      assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
      return true;
    });
  });

  it('Transaction with Memo works correctly with nonce', async () => {
    const provider = await buildConnection(constants.providerNetwork);
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
    const transfer = tx.transferWithMemo(sigKeypairWithBal, 'did:ssid:alice', 1, 'Memo Test', provider, nonce);
    await assert.doesNotReject(transfer);
  });

  it('Transaction with Memo throws error for unregistered DID', async () => {
    const provider = await buildConnection(constants.providerNetwork);

    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal?.address);
    const transfer = tx.transferWithMemo(sigKeypairWithBal, 'did:ssid:nonexistentdid', 1, 'Memo Test', provider, nonce);
    await assert.rejects(transfer, (err: { message: any; }) => {
      assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
      return true;
    });
  });

  return true;
});
