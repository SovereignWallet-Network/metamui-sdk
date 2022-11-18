import * as assert from 'assert';
import * as tokenchain from '../src/tokenchain';
import { buildConnection } from '../src/connection';
import { ApiPromise } from '@polkadot/api';

describe('Tokenchain works correctly', () => {
    let provider: ApiPromise;
    let tokenName: string = 'SGD';

    it('Get Token List Works correctly', async () => {
        provider = await buildConnection('dev');
        const tokenList = await tokenchain.getTokenList(provider);
        // console.log(tokenList);
        assert.notEqual(tokenList, null);
    });

    it('lookupTokenchain Works correctly', async () => {
        provider = await buildConnection('dev');
        const paraId = await tokenchain.lookupTokenchain(tokenName, provider);
        assert.equal(paraId, 2000);
    });

    it('reverseLookupTokenchain Works correctly', async () => {
        provider = await buildConnection('dev');
        const tokenName = await tokenchain.reverseLookupTokenchain(2000, provider);
        assert.equal(tokenName, 'SGD');
    });

    // Add local tests for parachain addition and removal

});
