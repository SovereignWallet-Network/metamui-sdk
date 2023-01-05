import { buildConnection } from './connection';
import { ApiPromise } from '@polkadot/api';
import { submitTransaction } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToString } from './utils';
import { HexString } from '@polkadot/util/types';
import { utils } from '.';
import { sanitiseCCode } from './token';
import { getVCs } from './vc';

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
            name: hexToString(tokenInfo),
        });
    }
    tokenList.push({ id: null, name: 'MUI' });
    tokenList.sort((a, b) => a.name > b.name ? 1 : -1);
    return tokenList;
}

/**
 * Lookup Tokenchain with Token Name to get ParaId
 * @param {HexString|String} tokenName
 * @param {ApiPromise} api
 * @returns {Number} Para Id
 */
 async function lookup(tokenName: HexString|String, api: ApiPromise) {
    const provider = api || (await buildConnection('local'));
    const paraId = (await provider.query.tokenchain.lookup(sanitiseCCode(tokenName))).toString();
    return parseInt(paraId, 10);
}

/**
 * Reverse Lookup Tokenchain with ParaId to get Token Name
 * @param {Number} paraId
 * @param {ApiPromise} api
 * @returns {String} Token Name
 */
async function lookUpParaId(paraId: Number, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return utils.tidy(hexToString((await provider.query.tokenchain.rLookup(paraId)).toString())).toUpperCase();
}


/**
 * Get Token Issuer by currency code
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {String} Token Isssuer Did
 */
 async function getTokenIssuer(currencyCode: String, api: ApiPromise): Promise<string> {
    const provider = api || (await buildConnection('local'));
    return (await provider.query.tokenchain.tokenIssuers(currencyCode)).toHex();
}

/**
 * Get Token Info by currency code
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Object} Token Details
 */
 async function getTokenInfo(currencyCode: String, api: ApiPromise): Promise<any> {
    const provider = api || (await buildConnection('local'));
    let tokenInfo: any = (await provider.query.tokenchain.tokenInfos(sanitiseCCode(currencyCode))).toJSON();
    return {
        tokenName: hexToString(tokenInfo.tokenName),
        reservedBalance: tokenInfo.reservedBalance,
        initialIssuance: tokenInfo.initialIssuance,
        decimal: tokenInfo.decimal
    };
}

/**
 * Add new parachain (requires sudo)
 * @param {HexString} vcId Currency Code HexString
 * @param {number} initialIssuance LOWEST FORM
 * @param {KeyringPair} sudoAccountKeyPair
 * @param {ApiPromise} api
 */
async function initParachain(vcId: HexString, initialIssuance: number, sudoAccountKeyPair:KeyringPair, api: ApiPromise) {
    const provider = api || (await buildConnection('local'));
    const vc_check = await getVCs(vcId, provider);
    if(vc_check == null)
        throw new Error('VC does not exist');
    if(initialIssuance < 1 || initialIssuance == null)
        throw new Error('Initial Issuance must be greater than 0');
    const tx = provider.tx.sudo.sudo(
        provider.tx.tokenchain.initParachain(vcId, initialIssuance)
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
        provider.tx.tokenchain.removeParachain(sanitiseCCode(tokenName))
    );
    let nonce = await provider.rpc.system.accountNextIndex(sudoAccountKeyPair.address);
    let signedTx = await tx.signAsync(sudoAccountKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

export {
    getTokenList,
    lookup,
    lookUpParaId,
    initParachain,
    removeParachain,
    getTokenIssuer,
    getTokenInfo,
};
