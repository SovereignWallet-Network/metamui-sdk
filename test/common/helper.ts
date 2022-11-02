import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import * as tx from '../../src/balances';
import * as collective from '../../src/collective';
import { submitTransaction } from '../../src/common/helper';

const TEST_DAVE_DID = "did:ssid:dave";
const TEST_SWN_DID = "did:ssid:swn";
const TEST_ROOT_DID = 'did:ssid:alice';

async function councilStoreVC(vcHex: any, sigKeypairOwner: any, sigKeypairRoot: KeyringPair, sigKeypairCouncil: KeyringPair, provider: ApiPromise) {

  let nonce = await provider?.rpc.system.accountNextIndex(sigKeypairRoot.address);
  await tx.transfer(sigKeypairRoot, TEST_DAVE_DID, 5000000, provider, nonce);
  let newMembers = [
    TEST_DAVE_DID,
    TEST_ROOT_DID,
    TEST_SWN_DID,
  ];
  await collective.setMembers(newMembers, TEST_SWN_DID, 0, sigKeypairRoot, provider);
  const call = provider.tx.vc.store(vcHex);
  const propose = await collective.propose(3, call, 1000, sigKeypairOwner, provider);
  const proposal = propose.events.council.Proposed;
  // console.log("Proposal: ", proposal);
  const proposalHash = proposal.proposalHash;
  let vote = await collective.getVotes(proposalHash, provider);
  const index = vote?.['index'];
  await collective.vote(proposalHash, index, true, sigKeypairRoot, provider);
  await collective.vote(proposalHash, index, true, sigKeypairCouncil, provider);
  await collective.vote(proposalHash, index, true, sigKeypairOwner, provider);
  return await collective.close(proposalHash, index, 1000, 1000, sigKeypairRoot, provider);
}

async function sudoStoreVC(vcHex: string, sudoKeyPair: KeyringPair, provider: ApiPromise) {
    const tx = provider.tx.sudo.sudo(provider.tx.vc.store(vcHex));
    const nonce = await provider.rpc.system.accountNextIndex(sudoKeyPair.address);
    const signedTx = await tx.signAsync(sudoKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

async function councilVoteTxn(call, sigKeypairOwner: any, sigKeypairRoot: KeyringPair, sigKeypairCouncil: KeyringPair, provider: ApiPromise) {
  
  let nonce = await provider?.rpc.system.accountNextIndex(sigKeypairRoot.address);
  await tx.transfer(sigKeypairRoot, TEST_DAVE_DID, 5000000, provider, nonce);
  let newMembers = [
    TEST_DAVE_DID,
    TEST_ROOT_DID,
    TEST_SWN_DID,
  ];
  await collective.setMembers(newMembers, TEST_SWN_DID, 0, sigKeypairRoot, provider);
  const propose = await collective.propose(3, call, 1000, sigKeypairOwner, provider);
  const proposal = propose.events.council.Proposed;
  // console.log("Proposal: ", proposal);
  const proposalHash = proposal.proposalHash;
  let vote = await collective.getVotes(proposalHash, provider);
  const index = vote?.['index'];
  await collective.vote(proposalHash, index, true, sigKeypairRoot, provider);
  await collective.vote(proposalHash, index, true, sigKeypairCouncil, provider);
  await collective.vote(proposalHash, index, true, sigKeypairOwner, provider);
  return await collective.close(proposalHash, index, 506043000, 1000, sigKeypairRoot, provider);
}

async function sudoTxn(call, sudoKeyPair: KeyringPair, provider: ApiPromise) {
  const tx = provider.tx.sudo.sudo(call);
  const nonce = await provider.rpc.system.accountNextIndex(sudoKeyPair.address);
  const signedTx = await tx.signAsync(sudoKeyPair, { nonce });
  return submitTransaction(signedTx, provider);
}

export {
  councilStoreVC,
  sudoStoreVC,
  councilVoteTxn,
  sudoTxn,
}