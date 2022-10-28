import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
/**
 * Set Members and prime of collective pallet
 * @param  {Array<String>} newMembers Array of Did
 * @param  {String} prime Did of Prime
 * @param  {Number} oldCount Old members count
 * @param  {KeyPair} signingKeypair Key pair of Sender
 * @returns {String} Hash
 */
declare function setMembers(newMembers: String[], prime: String, oldCount: number, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * To create a proposal
 * @param  {Number} threshold Threshold to successfull execution
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of call
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
declare function propose(threshold: any, proposal: any, lengthCount: any, signingKeypair: any, api: ApiPromise): Promise<any>;
/**
 * To Execute a call
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of Call
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
declare function execute(proposal: any, lengthCount: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Vote on a proposal
 * @param  {String} proposalHash Hash of proposal
 * @param  {Number} index Proposal index
 * @param  {Boolean} approve True/false
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
declare function vote(proposalHash: any, index: any, approve: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Close a proposal manually, executes call if yes votes is greater than or equal to threshold
 * @param  {String} proposalHash Hash
 * @param  {Number} index Proposal index
 * @param  {Boolean} proposalWeightBond Weight
 * @param  {Number} lengthCount Length
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
declare function close(proposalHash: any, index: any, proposalWeightBond: any, lengthCount: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Disapprove proposal
 * @param  {String} proposalHash Hash
 * @param  {KeyPair} signingKeypair Key pair of sender
 */
declare function disapproveProposal(proposalHash: any, signingKeypair: KeyringPair, api: ApiPromise): Promise<any>;
/**
 * Get Members of Council
 * @param  {Boolean} api Network Provider
 */
declare function getMembers(api?: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get Prime of Council
 * @param  {Boolean} api Network Provider
 */
declare function getPrime(api?: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get All Proposals
 * @param  {Boolean} api Network Provider
 */
declare function getProposals(api?: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get Proposal of given hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {Boolean} api Network Provider
 */
declare function getProposalOf(proposalHash: String, api?: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get Votes of given proposal hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {Boolean} api Network Provider
 */
declare function getVotes(proposalHash: String, api?: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
/**
 * Get Total proposals count
 * @param  {Boolean} api Network Provider
 */
declare function getProposalCount(api?: ApiPromise): Promise<import("@polkadot/types-codec/types").AnyJson>;
export { setMembers, propose, execute, vote, close, disapproveProposal, getMembers, getPrime, getProposals, getProposalOf, getVotes, getProposalCount, };
