"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposalCount = exports.getVotes = exports.getProposalOf = exports.getProposals = exports.getPrime = exports.getMembers = exports.disapproveProposal = exports.close = exports.vote = exports.execute = exports.propose = exports.setMembers = void 0;
const did = __importStar(require("./did"));
const connection_1 = require("./connection");
const helper_1 = require("./common/helper");
/**
 * Set Members and prime of collective pallet
 * @param  {Array<String>} newMembers Array of Did
 * @param  {String} prime Did of Prime
 * @param  {Number} oldCount Old members count
 * @param  {KeyPair} signingKeypair Key pair of Sender
 * @returns {String} Hash
 */
function setMembers(newMembers, prime, oldCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        newMembers = newMembers.map(newMember => did.sanitiseDid(newMember));
        prime = prime ? did.sanitiseDid(prime) : null;
        const tx = provider.tx.sudo.sudo(provider.tx.council.setMembers(newMembers, prime, oldCount));
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.setMembers = setMembers;
/**
 * To create a proposal
 * @param  {Number} threshold Threshold to successfull execution
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of call
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
function propose(threshold, proposal, lengthCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.council.propose(threshold, proposal, lengthCount);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.propose = propose;
/**
 * To Execute a call
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of Call
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
function execute(proposal, lengthCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.council.execute(proposal, lengthCount);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.execute = execute;
/**
 * Vote on a proposal
 * @param  {String} proposalHash Hash of proposal
 * @param  {Number} index Proposal index
 * @param  {Boolean} approve True/false
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
function vote(proposalHash, index, approve, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.council.vote(proposalHash, index, approve);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.vote = vote;
/**
 * Close a proposal manually, executes call if yes votes is greater than or equal to threshold
 * @param  {String} proposalHash Hash
 * @param  {Number} index Proposal index
 * @param  {Boolean} proposalWeightBond Weight
 * @param  {Number} lengthCount Length
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
function close(proposalHash, index, proposalWeightBond, lengthCount, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.council.close(proposalHash, index, proposalWeightBond, lengthCount);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.close = close;
/**
 * Disapprove proposal
 * @param  {String} proposalHash Hash
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
function disapproveProposal(proposalHash, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.sudo.sudo(provider.tx.council.disapproveProposal(proposalHash));
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.disapproveProposal = disapproveProposal;
/**
 * Get Members of Council
 * @param  {Boolean} api Network Provider
 */
function getMembers(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.council.members()).toJSON();
    });
}
exports.getMembers = getMembers;
/**
 * Get Prime of Council
 * @param  {Boolean} api Network Provider
 */
function getPrime(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.council.prime()).toJSON();
    });
}
exports.getPrime = getPrime;
/**
 * Get All Proposals
 * @param  {Boolean} api Network Provider
 */
function getProposals(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.council.proposals()).toJSON();
    });
}
exports.getProposals = getProposals;
/**
 * Get Proposal of given hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {Boolean} api Network Provider
 */
function getProposalOf(proposalHash, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.council.proposalOf(proposalHash)).toJSON();
    });
}
exports.getProposalOf = getProposalOf;
/**
 * Get Votes of given proposal hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {Boolean} api Network Provider
 */
function getVotes(proposalHash, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.council.voting(proposalHash)).toJSON();
    });
}
exports.getVotes = getVotes;
/**
 * Get Total proposals count
 * @param  {Boolean} api Network Provider
 */
function getProposalCount(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.council.proposalCount()).toJSON();
    });
}
exports.getProposalCount = getProposalCount;
