import * as assert from 'assert';
// import sha256 from 'js-sha256';
const sha256 = require('js-sha256');
import { stringToU8a, u8aToHex } from '@polkadot/util';
import * as vc from '../src/verified_credentials';
import vcJson from '../src/vc_schema/identity.json';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './test_constants';

describe('VC works correctly', () => {
  const originJson = vcJson;
  originJson.name = 'Mathew Joseph';
  originJson.email = 'test@test.com';
  originJson.country = 'India';
  originJson.owner_did = 'did:ssid:mathew';
  originJson.issued_block = '2244';
  // this schema is expected in the dev chain for the test to pass
  const schemaToTest = constants.validSchema;
  const expectedHash = u8aToHex(sha256(stringToU8a(JSON.stringify(originJson))));
  let sigKeypair: any = null;
  const sigDid = 'did:ssid:swn';
  var provider: any = null;

  before(async () => {
    const keyring = await initKeyring();
    sigKeypair = await keyring.addFromUri('//Alice');
    provider = await buildConnection('testnet');
  });

  it('VC is created in correct format', async () => {
    const rawVC = await vc.createVC(originJson, schemaToTest, provider);
    assert.strictEqual(rawVC.properties, originJson);
    assert.strictEqual(rawVC.hash, expectedHash);
    assert.strictEqual(rawVC.verifier, undefined);
    assert.strictEqual(rawVC.signature, undefined);
    assert.strictEqual(rawVC.schema, schemaToTest);
  });

  it('VC is signed in correct format', async () => {
    const rawVC = await vc.createVC(originJson, schemaToTest, provider);
    const signedVC = await vc.signVC(rawVC, sigDid, sigKeypair);
    assert.strictEqual(signedVC.properties, originJson);
    assert.strictEqual(signedVC.hash, expectedHash);
    assert.strictEqual(signedVC.verifier, sigDid);
    assert.strictEqual(signedVC.schema, schemaToTest);
    // sr25519 signature are not deterministic, check only if value is present here
    assert.notStrictEqual(signedVC.schema, undefined);
  });

  it('VC verification works ', async () => {
    const rawVC = await vc.createVC(originJson, schemaToTest, provider);
    const signedVC = await vc.signVC(rawVC, sigDid, sigKeypair);
    const res = await vc.verifyVC(signedVC, provider);
    assert.strictEqual(res, true);
  });
});