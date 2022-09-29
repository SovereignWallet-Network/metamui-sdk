import assert from 'assert';
import { expect } from 'chai';
import * as tx from '../src/transaction';
import * as did from '../src/did';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './test_constants';
import { removeDid } from './helper/helper';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';

describe('Transaction works correctly', () => {
  let sigKeypairWithBal: KeyringPair;
  let sigKeypairWithoutBal: KeyringPair;
  let provider: ApiPromise;
  before(async () => {
    const keyring = await initKeyring();
    const provider = await buildConnection(constants.providerNetwork);
    sigKeypairWithBal = keyring.addFromUri(constants.mnemonicWithBalance);
    sigKeypairWithoutBal = keyring.addFromUri('//Test123');
    if (constants.providerNetwork == 'local') {
      let sigKeypairEve = await keyring.addFromUri('//Eve');
      const didObj = {
        private: {
          public_key: sigKeypairEve.publicKey, // this is the public key linked to the did
          identity: 'did:ssid:metamui', // this is the actual did
          metadata: 'Metadata',
        }
      };
      let sigKeypairDave = await keyring.addFromUri('//Dave');
      const didObjDave = {
        private: {
          public_key: sigKeypairDave.publicKey, // this is the public key linked to the did
          identity: 'did:ssid:testing_mui', // this is the actual did
          metadata: 'Metadata',
        }
      };
      // try {
      //   await did.storeDIDOnChain(didObjDave, sigKeypairWithBal, provider);
      // } catch (err) {
      //   console.log(err);
      // }
      // try {
      //   await did.storeDIDOnChain(didObj, sigKeypairWithBal, provider);
      // } catch (err) {
      //   console.log(err);
      // }
    }
    // const transfer = await tx.sendTransaction(sigKeypairWithBal, 'did:ssid:alice', '1', provider);
    // assert.doesNotReject(transfer);
  });

  it('Transaction works correctly with nonce', async () => {
    const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
    const transfer: any = await tx.sendTransaction(sigKeypairWithBal, 'did:ssid:alice', 1, provider, nonce);
    assert.doesNotReject(transfer);

  });

  it('Transaction throws error for unregistered DID', async () => {
    const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal.address);
    const transfer: any = await tx.sendTransaction(sigKeypairWithBal, 'did:ssid:nonexistentdid', 1, provider, nonce);
    await assert.rejects(transfer, (err: { message: any; }) => {
      assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
      return true;

    });
  });

  // it('Transaction fails when sender has no balance', async () => {
  //   const provider = await buildConnection(constants.providerNetwork) as ApiPromise;
  //   if (sigKeypairWithoutBal?.address) {
  //     await tx.sendTransaction(sigKeypairWithoutBal, 'did:ssid:test1212', 1, provider).catch((err: { message: any; }) => {
  //       assert.strictEqual(err.message, 'balances.InsufficientBalance');
  //     }
  //     );
  //   }
  // });

  it('Transaction fails when recipent has no DID', async () => {
    const provider = await buildConnection(constants.providerNetwork);
    await tx.sendTransaction(sigKeypairWithBal, 'Bob123', 1, provider).catch((err: { message: any; }) => {
      assert.strictEqual(err.message, 'balances.RecipentDIDNotRegistered');
    }
    );
  });

  it('Transaction with Memo works correctly with nonce', async () => {
    const provider = await buildConnection(constants.providerNetwork);

    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal?.address);
    const transfer: any = await tx.transfer(sigKeypairWithBal, 'did:ssid:bob', 1, 'Memo Test', provider, nonce);
    assert.doesNotReject(transfer);

  });

  it('Transaction with Memo throws error for unregistered DID', async () => {
    const provider = await buildConnection(constants.providerNetwork);

    const nonce = await provider.rpc.system.accountNextIndex(sigKeypairWithBal?.address);
    const transfer: any = await tx.transfer(sigKeypairWithBal, 'did:ssid:nonexistentdid', 1, 'Memo Test', provider, nonce);
    await assert.rejects(transfer, err => {
      assert.strictEqual(err, 'balances.RecipentDIDNotRegistered');
      return true;
    });

  });

  after(async () => {
    // Delete created DIDs
    if (constants.providerNetwork == 'local') {
      // await removeDid('did:ssid:metamui', sigKeypairWithBal, provider);
      // await removeDid('did:ssid:testing_mui', sigKeypairWithBal, provider);
    }
  })

  return true;
});
