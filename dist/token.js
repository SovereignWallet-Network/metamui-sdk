var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { resolveDIDToAccount } from './did';
import { buildConnection } from './connection';
import { sanitiseDid } from './did';
import { submitTransaction } from './common/helper';
/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function mintToken(vcId, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.token.mintToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function slashToken(vcId, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.token.slashToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {String} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
*/
function transferToken(vcId, toDid, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        let to_did_hex = sanitiseDid(toDid);
        let to_did_check = yield resolveDIDToAccount(to_did_hex, api);
        if (!to_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.token.transferToken(vcId, to_did_hex);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Withdraw Reserved tokens from one DID to another DID
 * @param {String} toDid
 * @param {String} fromDid
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function withdrawReserved(toDid, fromDid, amount, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        let [to_account_id, from_account_id] = yield Promise.all([
            resolveDIDToAccount(sanitiseDid(toDid), api),
            resolveDIDToAccount(sanitiseDid(fromDid), api)
        ]);
        if (!to_account_id) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        if (!from_account_id) {
            throw new Error('DID.SenderDIDNotRegistered');
        }
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.token.withdrawReserved(sanitiseDid(toDid), sanitiseDid(fromDid), amount);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
export { mintToken, slashToken, transferToken, withdrawReserved };
