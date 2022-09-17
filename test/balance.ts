import { KeyringPair } from '@polkadot/keyring/types';
import assert from 'assert';
import * as balance from '../src/balance';
import {initKeyring} from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './test_constants';

// const { KeyringPair } = require('@polkadot/keyring/types');
// const { Keyring } = require('@polkadot/keyring');
// const assert = require('assert');
// const balance = require('../src/balance');
// const {initKeyring} = require('../src/config');
// const {buildConnection} = require('../src/connection');
// const constants = require('./test_constants');


describe('Balances works correctly', () => {
  let provider: any = null;
  let sigKeypairWithBal;
  // let sigKeypairWithBal: typeof KeyringPair = null;

  before(async () => {
    provider = await buildConnection(constants.providerNetwork);
    const keyring = await initKeyring();
    sigKeypairWithBal = await keyring.addFromUri(constants.mnemonicWithBalance);
  });

  it('getBalance works correctly', async () => {
    const balanceAmount: number = await balance.getBalance('did:ssid:swn', provider);
    assert.strictEqual(Math.floor(balanceAmount) >= 0, true);
  });

  it('subscribeToBalanceChanges works correctly', (done) => {
    let isCallbackCalled = false;
    balance.subscribeToBalanceChanges('did:ssid:swn', (balanceAmount) => {
      if(isCallbackCalled) return;
      isCallbackCalled = true;
      assert.strictEqual(Math.floor(balanceAmount) >= 0, true);
      done();
    }, provider);
  });

})