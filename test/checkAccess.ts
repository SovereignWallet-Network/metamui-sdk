import * as assert from 'assert';
import { ApiPromise, Keyring } from "@polkadot/api";
import { buildConnection } from "../src/connection";
import { KeyringPair } from '@polkadot/keyring/types';
import { sanitiseDid } from "../src/did";
import { submitTransaction } from '../src/common/helper';
import * as checkAccess from '../src/checkAccess';

describe('checkAccess works correctly', () => {
    let provider: ApiPromise;
    let did: string;
    let accountId: string;
    let publicKey: string;
    let sigKeyPairValidator: KeyringPair;

    before(async () => {
        provider = await buildConnection('dev');
        did = "did:ssid:swn";
        accountId = "5Di3HRA779SPEGkjrGw1SN22bPjFX1KmqLMgtSFpYk1idV7A";
        publicKey = "0x48b5b5a2b56cf1558e6aa3d2df1b7877c9bd7ca512984e85892fb351bd2a912e";
    });

    // Chain state query tests
    it('Fetch all blacklisted DIDs works correctly', async () => {
        assert.doesNotReject(await checkAccess.getBlacklistedDids(provider));
    })

    it('Get Blacklisting Reason for a DID', async () => {
        let blacklistedDid = 'did:ssid:blacklisted';
        assert.notEqual(await checkAccess.getBlacklistingReasonOfDid(sanitiseDid(blacklistedDid), provider), null);
    })

    it('Get blacklisting reason from reason code', async () => {
        let rCode = 0;
        assert.notEqual(await checkAccess.getBlacklistingReasonFromCode(rCode, provider), null);
    })

    it('Get Reason Code from Blacklisting Reason string', async () => {
        let reasonName = 'Spam Account';
        assert.notEqual(await checkAccess.getBlacklistingReasonCode(reasonName, provider), null);
    })
});