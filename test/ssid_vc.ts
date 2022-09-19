import assert from 'assert';
import * as ssidVC from '../src/ssid_vc';
import { sha256 } from 'js-sha256';
import { stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import ssidJson from '../src/vc_schema/ssid.json';
import { initKeyring } from '../src/config';
import * as constants from './test_constants';

describe('SSID VC works correctly', () => {
  const originJson = ssidJson;
  originJson.did = 'did:ssid:metamui';
  originJson.public_key = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const expectedHash = stringToHex(sha256(stringToU8a(JSON.stringify(originJson))));
  let sigKeypairWithBal: any = null;

  before(async () => {
    const keyring = await initKeyring();
    sigKeypairWithBal = await keyring.addFromUri(constants.mnemonicWithBalance);
  });

  it('SSID VC is created in correct format', async () => {
    const x = ssidVC.createSsidVC(originJson);
    assert.strictEqual(x.properties.did, originJson.did);
    assert.strictEqual(x.properties.public_key, originJson.public_key);
    assert.strictEqual(x.hash, expectedHash);
    assert.strictEqual(x.signature, undefined);
  });

  it('SSID VC signing works correctly', async () => {
    const x = ssidVC.createSsidVC(originJson);
    assert.strictEqual(x.signature, undefined);
    const signedVC = await ssidVC.signSsidVC(x, sigKeypairWithBal);
    assert.notEqual(x.signature, undefined);
    const isSignVerified = await ssidVC.verifySsidVC(signedVC);
    assert.strictEqual(isSignVerified, true);
  });
});
