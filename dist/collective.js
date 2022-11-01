var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as did from './did';
import { buildConnection } from './connection';
import { submitTransaction } from './common/helper';
/**
 * Set Members and prime of collective pallet
 * @param  {Array<String>} newMembers Array of Did
 * @param  {String} prime Did of Prime
 * @param  {Number} oldCount Old members count
 * @param  {KeyringPair} signingKeypair Key pair of Sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
function setMembers(newMembers, prime, oldCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        newMembers = newMembers.map(newMember => did.sanitiseDid(newMember));
        prime = prime ? did.sanitiseDid(prime) : null;
        const tx = provider.tx.sudo.sudo(provider.tx.council.setMembers(newMembers, prime, oldCount));
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * To create a proposal
 * @param  {Number} threshold Threshold to successfull execution
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of call
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
function propose(threshold, proposal, lengthCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.council.propose(threshold, proposal, lengthCount);
        const txnInfo = yield provider.tx.council.propose(threshold, proposal, lengthCount).paymentInfo(signingKeypair);
        console.log(`
  class=${txnInfo.class.toString()},
  weight=${txnInfo.weight.toString()},
  partialFee=${txnInfo.partialFee.toHuman()}
`);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * To Execute a call
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of Call
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
function execute(proposal, lengthCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.council.execute(proposal, lengthCount);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Vote on a proposal
 * @param  {String} proposalHash Hash of proposal
 * @param  {Number} index Proposal index
 * @param  {Boolean} approve True/false
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
function vote(proposalHash, index, approve, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.council.vote(proposalHash, index, approve);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Close a proposal manually, executes call if yes votes is greater than or equal to threshold
 * @param  {String} proposalHash Hash
 * @param  {Number} index Proposal index
 * @param  {Boolean} proposalWeightBond Weight
 * @param  {Number} lengthCount Length
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
function close(proposalHash, index, proposalWeightBond, lengthCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.council.close(proposalHash, index, proposalWeightBond, lengthCount);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Disapprove proposal
 * @param  {String} proposalHash Hash
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
function disapproveProposal(proposalHash, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        const tx = provider.tx.sudo.sudo(provider.tx.council.disapproveProposal(proposalHash));
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return submitTransaction(signedTx, provider);
    });
}
/**
 * Get Members of Council
 * @param  {ApiPromise} api Network Provider
 */
function getMembers(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        return (yield provider.query.council.members()).toJSON();
    });
}
/**
 * Get Prime of Council
 * @param  {ApiPromise} api Network Provider
 */
function getPrime(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        return (yield provider.query.council.prime()).toJSON();
    });
}
/**
 * Get All Proposals
 * @param  {ApiPromise} api Network Provider
 */
function getProposals(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        return (yield provider.query.council.proposals()).toJSON();
    });
}
/**
 * Get Proposal of given hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {ApiPromise} api Network Provider
 */
function getProposalOf(proposalHash, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        return (yield provider.query.council.proposalOf(proposalHash)).toJSON();
    });
}
/**
 * Get Votes of given proposal hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {ApiPromise} api Network Provider
 */
function getVotes(proposalHash, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        return (yield provider.query.council.voting(proposalHash)).toJSON();
    });
}
/**
 * Get Total proposals count
 * @param  {ApiPromise} api Network Provider
 */
function getProposalCount(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield buildConnection('local'));
        return (yield provider.query.council.proposalCount()).toJSON();
    });
}
export { setMembers, propose, execute, vote, close, disapproveProposal, getMembers, getPrime, getProposals, getProposalOf, getVotes, getProposalCount, };
