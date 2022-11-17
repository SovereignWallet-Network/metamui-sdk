import { stringToHex } from '@polkadot/util';
import assert from 'assert';
import { mnemonicWithBalance, validSchema } from './common/constants';
import { sha256 } from 'js-sha256';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as kycUtils from '../src/kycUtils';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise } from '@polkadot/api';
import { providerNetwork } from '../test/common/constants';


const vcJson = {
    "name" : "",
    "email" : "",
    "country" : "",
    "owner_did" : "",
    "issued_block" : ""
};

const ssidJson = {
    "did" : "",
    "public_key" : ""
};

describe('KYC Utils', () => {
    const originJson = vcJson;
    originJson.name = 'Mathew Joseph';
    originJson.email = 'test@test.com';
    originJson.country = 'India';
    originJson.owner_did = 'did:ssid:mathew';
    originJson.issued_block = '2244';

    const testJson = ssidJson;
    testJson.did = 'did:ssid:metamui';
    if(providerNetwork == 'dev') {
      testJson.public_key = '5Di3HRA779SPEGkjrGw1SN22bPjFX1KmqLMgtSFpYk1idV7A';
    } else if(providerNetwork == 'local') {
      testJson.public_key = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    }

    const expectedTestHash = stringToHex(sha256(JSON.stringify(testJson)));

    const schemaToTest = validSchema;
    const expectedHash = stringToHex(sha256(JSON.stringify(originJson)));
    let sigKeyPair: KeyringPair;
    const sigDid = 'did:ssid:swn';
    let provider: ApiPromise;

    before(async () => {
        const keyring = await initKeyring();
        sigKeyPair = keyring.addFromUri("cruise owner unveil parrot coast gym opera avocado flock diesel able news farm pole visa piano powder help call refuse awake good trumpet perfect");
        provider = await buildConnection('dev');
    });


    it('VC is created in correct format', async () => {
        const rawVC = await kycUtils.createVC(originJson);
        assert.strictEqual(rawVC.properties, originJson);
        assert.strictEqual(rawVC.hash, expectedHash);
        assert.strictEqual(rawVC.verifier, undefined);
        assert.strictEqual(rawVC.signature, undefined);
      });
    
      it('VC is signed in correct format', async () => {
        const rawVC = await kycUtils.createVC(originJson);
        const signedVC = await kycUtils.signVC(rawVC, sigDid, sigKeyPair);
        assert.strictEqual(signedVC.properties, originJson);
        assert.strictEqual(signedVC.hash, expectedHash);
        assert.strictEqual(signedVC.verifier, sigDid);
      });
    
      it('VC verification works ', async () => {
        const rawVC = await kycUtils.createVC(originJson);
        const signedVC = await kycUtils.signVC(rawVC, sigDid, sigKeyPair);
        const res = await kycUtils.verifyVC(signedVC, provider);
        assert.strictEqual(res, true);
      });

      it('SSID VC is created in correct format', async () => {
        const x:any = await kycUtils.createSsidVC(testJson);
        assert.strictEqual(x.properties.did, testJson.did);
        assert.strictEqual(x.properties.public_key, testJson.public_key);
        assert.strictEqual(x.hash, expectedTestHash);
        assert.strictEqual(x.signature, undefined);
      });

      it('SSID VC signing works correctly', async () => {
        const x:any = await kycUtils.createSsidVC(testJson);
        assert.strictEqual(x.signature, undefined);
        const signedVC = await kycUtils.signSsidVC(x, sigKeyPair);
        console.log(signedVC);
        assert.notEqual(x.signature, undefined);
        const isSignVerified = await kycUtils.verifySsidVC(signedVC);
        assert.strictEqual(isSignVerified, true);
      });
});