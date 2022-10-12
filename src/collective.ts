import * as did from './did';
import { buildConnection } from './connection';
import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types';
import { submitTransaction } from './common/helper';

/**
 * Set Members and prime of collective pallet
 * @param  {Array<String>} newMembers Array of Did
 * @param  {String} prime Did of Prime
 * @param  {Number} oldCount Old members count
 * @param  {KeyPair} signingKeypair Key pair of Sender
 * @returns {String} Hash
 */
async function setMembers(newMembers: String[], prime: String, oldCount: number, signingKeypair: KeyringPair, api: ApiPromise) {
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
 * @param  {KeyPair} signingKeypair Key pair of sender
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
 * @param  {KeyPair} signingKeypair Key pair of sender
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
 * @param  {String} proposalHash Hash of proposal
 * @param  {Number} index Proposal index
 * @param  {Boolean} approve True/false
 * @param  {KeyPair} signingKeypair Key pair of sender
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
 * @param  {String} proposalHash Hash
 * @param  {Number} index Proposal index
 * @param  {Boolean} proposalWeightBond Weight
 * @param  {Number} lengthCount Length
 * @param  {KeyPair} signingKeypair Key pair of sender
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
 * @param  {String} proposalHash Hash
 * @param  {KeyPair} signingKeypair Key pair of sender
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
 * @param  {Boolean} api Network Provider
 */
async function getMembers(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.members()).toHuman();
}
/**
 * Get Prime of Council
 * @param  {Boolean} api Network Provider
 */
async function getPrime(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.prime()).toHuman();
}
/**
 * Get All Proposals
 * @param  {Boolean} api Network Provider
 */
async function getProposals(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.proposals()).toHuman();
}
/**
 * Get Proposal of given hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {Boolean} api Network Provider
 */
async function getProposalOf(proposalHash: String, api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.proposalOf(proposalHash)).toHuman();
}
/**
 * Get Votes of given proposal hash
 * @param {Hash} proposalHash Hash of proposal
 * @param  {Boolean} api Network Provider
 */
async function getVotes(proposalHash: String, api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.voting(proposalHash)).toHuman();
}
/**
 * Get Total proposals count
 * @param  {Boolean} api Network Provider
 */
async function getProposalCount(api?: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  return (await provider.query.council.proposalCount()).toHuman();
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