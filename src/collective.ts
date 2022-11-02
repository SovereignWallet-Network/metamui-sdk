import * as did from './did';
import { buildConnection } from './connection';
import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types';
import { submitTransaction } from './common/helper';

/**
 * Set Members and prime of collective pallet
 * @param  {Array<string>} newMembers Array of Did
 * @param  {string} prime Did of Prime
 * @param  {Number} oldCount Old members count
 * @param  {KeyringPair} signingKeypair Key pair of Sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
async function setMembers(newMembers: string[], prime: string, oldCount: number, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || await buildConnection('local');
  newMembers = newMembers.map(newMember => did.sanitiseDid(newMember));
  prime = prime ? did.sanitiseDid(prime) : null;
  const tx = provider.tx.sudo.sudo(
    provider.tx.council.setMembers(newMembers, prime, oldCount)
  );
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
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
async function propose(threshold, proposal, lengthCount, signingKeypair, api: ApiPromise) {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.council.propose(threshold, proposal, lengthCount);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * To Execute a call
 * @param  {Call} proposal Call to propose
 * @param  {Number} lengthCount Length of Call
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
async function execute(proposal, lengthCount, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.council.execute(proposal, lengthCount);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Vote on a proposal
 * @param  {string} proposalHash Hash of proposal
 * @param  {Number} index Proposal index
 * @param  {Boolean} approve True/false
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
async function vote(proposalHash, index, approve, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.council.vote(proposalHash, index, approve);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Close a proposal manually, executes call if yes votes is greater than or equal to threshold
 * @param  {string} proposalHash Hash
 * @param  {Number} index Proposal index
 * @param  {Boolean} proposalWeightBond Weight
 * @param  {Number} lengthCount Length
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
async function close(proposalHash, index, proposalWeightBond, lengthCount, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.council.close(proposalHash, index, proposalWeightBond, lengthCount);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Disapprove proposal
 * @param  {string} proposalHash Hash
 * @param  {KeyringPair} signingKeypair Key pair of sender
 * @param  {ApiPromise} api Network Provider
 * @returns {Object} Transaction Object
 */
async function disapproveProposal(proposalHash, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || await buildConnection('local');
  const tx = provider.tx.sudo.sudo(
    provider.tx.council.disapproveProposal(proposalHash)
  );
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}
/**
 * Get Members of Council
 * @param  {ApiPromise} api Network Provider
 */
async function getMembers(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.members()).toJSON();
}
/**
 * Get Prime of Council
 * @param  {ApiPromise} api Network Provider
 */
async function getPrime(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.prime()).toJSON();
}
/**
 * Get All Proposals
 * @param  {ApiPromise} api Network Provider
 */
async function getProposals(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.proposals()).toJSON();
}
/**
 * Get Proposal of given hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {ApiPromise} api Network Provider
 */
async function getProposalOf(proposalHash: string, api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.proposalOf(proposalHash)).toJSON();
}
/**
 * Get Votes of given proposal hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {ApiPromise} api Network Provider
 */
async function getVotes(proposalHash: string, api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.voting(proposalHash)).toJSON();
}
/**
 * Get Total proposals count
 * @param  {ApiPromise} api Network Provider
 */
async function getProposalCount(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.proposalCount()).toJSON();
}

export {
  setMembers,
  propose,
  execute,
  vote,
  close,
  disapproveProposal,
  getMembers,
  getPrime,
  getProposals,
  getProposalOf,
  getVotes,
  getProposalCount,
}