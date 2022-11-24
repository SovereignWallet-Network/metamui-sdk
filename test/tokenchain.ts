import * as assert from 'assert';
import * as tokenchain from '../src/tokenchain';
import { buildConnection } from '../src/connection';
import { ApiPromise } from '@polkadot/api';

describe('Tokenchain works correctly', () => {
    let provider: ApiPromise;
    let validTokenName: string = 'SGD';
    let invalidTokenName: string = 'SGD1';
    let validParaId: number = 2000;
    let invalidParaId: number = 2001;

    before(async () => {
        provider = await buildConnection('dev', true);
    });

    it('Get Token List Works correctly', async () => {
        const tokenList = await tokenchain.getTokenList(provider);
        console.log(tokenList);
        assert.notEqual(tokenList, null);
    });

    it('lookupTokenchain Works correctly', async () => {
        const paraId = await tokenchain.lookupTokenchain(validTokenName, provider);
        assert.equal(paraId, validParaId);
    });

    it('lookupTokenchain Works correctly for invalid token name', async () => {
        const paraId = await tokenchain.lookupTokenchain(invalidTokenName, provider);
        assert.equal(paraId, NaN);
    });

    it('reverseLookupTokenchain Works correctly', async () => {
        const tokenName = await tokenchain.reverseLookupTokenchain(validParaId, provider);
        assert.equal(tokenName, validTokenName);
    });

    it('reverseLookupTokenchain Works correctly for invalid paraId', async () => {
        const tokenName = await tokenchain.reverseLookupTokenchain(invalidParaId, provider);
        assert.equal(tokenName, "");
    });

    // Add local tests for parachain addition and removal

});
