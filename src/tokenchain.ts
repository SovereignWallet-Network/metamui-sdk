import { buildConnection } from './connection';
import { ApiPromise } from '@polkadot/api';
import { submitTransaction } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToString } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { utils } from '.';
global.Buffer = require('buffer').Buffer;

/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
const sanitiseToken = (token: String): String => {
    if (token.startsWith('0x'))
        return token.padEnd(16, '0');
        
    return '0x' + Buffer.from(token, 'utf8').toString('hex').padEnd(16, '0');
}

/**
 * get Token List
 * @param {ApiPromise} api
 * @returns {Object} Token List
 */
 async function getTokenList(api: ApiPromise) {
    const provider = api || (await buildConnection('local'));
    const paraIds: any = (await provider.query.paras.parachains());
    let tokenList = [];
    for (let i = 0; i < paraIds.length; i++) {
        let tokenInfo = String(await provider.query.tokenchain.rLookup(paraIds[i]));
        tokenList.push({
            id: paraIds[i].toString(),
            name: utils.tidy(hexToString(tokenInfo)),
        });
    }
    return tokenList;
}

/**
 * Lookup Tokenchain with Token Name to get ParaId
 * @param {HexString|String} tokenName
 * @param {ApiPromise} api
 * @returns {Number} Para Id
 */
 async function lookupTokenchain(tokenName: HexString|String, api: ApiPromise) {
    const provider = api || (await buildConnection('local'));
    const paraId = (await provider.query.tokenchain.lookup(sanitiseToken(tokenName))).toString();
    return parseInt(paraId, 10);
}

/**
 * Reverse Lookup Tokenchain with ParaId to get Token Name
 * @param {Number} paraId
 * @param {ApiPromise} api
 * @returns {String} Token Name
 */
async function reverseLookupTokenchain(paraId: Number, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return utils.tidy(hexToString((await provider.query.tokenchain.rLookup(paraId)).toString()));
}

/**
 * Add new parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {Number} paraId
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
async function addParachain(tokenName: String, paraId: Number, sudoAccountKeyPair:KeyringPair, api: ApiPromise) {
    const provider = api || (await buildConnection('local'));
    const tx = provider.tx.sudo.sudo(
        provider.tx.tokenchain.addParachain(paraId, sanitiseToken(tokenName))
    );
    let nonce = await provider.rpc.system.accountNextIndex(sudoAccountKeyPair.address);
    let signedTx = await tx.signAsync(sudoAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

/**
 * Remove parachain (requires sudo)
 * @param {String} tokenName Currency Code HexString
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
 async function removeParachain(tokenName: String, sudoAccountKeyPair:KeyringPair, api: ApiPromise) {
    const provider = api || (await buildConnection('local'));
    const tx = provider.tx.sudo.sudo(
        provider.tx.tokenchain.removeParachain(sanitiseToken(tokenName))
    );
    let nonce = await provider.rpc.system.accountNextIndex(sudoAccountKeyPair.address);
    let signedTx = await tx.signAsync(sudoAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

export {
    sanitiseToken,
    getTokenList,
    lookupTokenchain,
    reverseLookupTokenchain,
    addParachain,
    removeParachain
};
