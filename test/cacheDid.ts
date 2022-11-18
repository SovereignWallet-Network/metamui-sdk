import * as assert from 'assert';
import * as cacheDid from '../src/cacheDid';
import { buildConnectionByUrl } from '../src/connection';
import { ApiPromise } from '@polkadot/api';
import { sanitiseDid } from '../src/did';
import { utils } from '../src';

describe('cacheDid works correctly', () => {
    let provider: ApiPromise;
    let did: string;
    let accountId: string;
    let publicKey: string;

    before(async () => {
        provider = await buildConnectionByUrl('wss://t1devnet.metabit.exchange/');
        did = "did:ssid:swn";
        accountId = "5Di3HRA779SPEGkjrGw1SN22bPjFX1KmqLMgtSFpYk1idV7A";
        publicKey = "0x48b5b5a2b56cf1558e6aa3d2df1b7877c9bd7ca512984e85892fb351bd2a912e";
    });

    it('getDidType works correctly', async () => {
        const didType = (await cacheDid.getDidType(sanitiseDid(did), provider)).toString();
        assert.equal(didType, 'Private');
    });

    it('getPublicKey works correctly', async () => {
        const publicKeyTest = (await cacheDid.getPublicKey(sanitiseDid(did), provider)).toString();
        assert.equal(publicKeyTest, publicKey);
    });

    it('lookup works correctly', async () => {
        const accountIdTest = (await cacheDid.lookup(sanitiseDid(did), provider)).toString();
        assert.equal(accountIdTest, accountId);
    });

    it('reverseLookup works correctly', async () => {
        const didTest = await cacheDid.reverseLookup(accountId, provider);
        assert.equal(utils.tidy(didTest), did);
    });

});