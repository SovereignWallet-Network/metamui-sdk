import * as did from '../../src/did';
import { buildConnection } from '../../src/connection';
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import * as tx from '../../src/balances';
import * as vc from '../../src/vc';
import * as collective from '../../src/collective';
import { submitTransaction } from '../../src/common/helper';

const TEST_DID = 'did:ssid:rocket';
const TEST_DAVE_DID = "did:ssid:dave";
const TEST_SWN_DID = "did:ssid:swn";

// To remove DID after testing

async function removeDid(didString: string, sigKeyPair: KeyringPair, provider: ApiPromise) {
  try {
    const api = provider || (await buildConnection('local'));
    const txn = api.tx.validatorCommittee.execute(
      api.tx.did.remove(did.sanitiseDid(didString)
      ), 1000);
    const nonce = await api.rpc.system.accountNextIndex(sigKeyPair.address);
    await new Promise((resolve, reject) => txn.signAndSend(sigKeyPair, { nonce }, ({ status, dispatchError }) => {
      if (dispatchError) {
        reject('Dispatch error');
      } else if (status.isFinalized) {
        resolve(status.asFinalized.toHex());
      }
    }));
  } catch (err: any) {
    throw new Error(err);
  }
}

async function councilStoreVC(vcHex: any, sigKeypairOwner: any, sigKeypairRoot: KeyringPair, sigKeypairCouncil: KeyringPair, provider: ApiPromise) {

  let nonce = await provider?.rpc.system.accountNextIndex(sigKeypairRoot.address);
  await tx.transfer(sigKeypairRoot, TEST_DAVE_DID, 5000000, provider, nonce);
  let newMembers = [
    TEST_DAVE_DID,
    TEST_DID,
    TEST_SWN_DID,
  ];
  await collective.setMembers(newMembers, TEST_SWN_DID, 0, sigKeypairRoot, provider);
  const call = provider.tx.vc.store(vcHex);
  await collective.propose(3, call, 1000, sigKeypairOwner, provider);
  const actualProposals = await collective.getProposals(provider);
  const proposalHash = actualProposals?.[0];
  let vote = await collective.getVotes(proposalHash, provider);
  const index = vote?.['index'];
  await collective.vote(proposalHash, index, true, sigKeypairRoot, provider);
  await collective.vote(proposalHash, index, true, sigKeypairCouncil, provider);
  await collective.close(proposalHash, index, 1000, 1000, sigKeypairRoot, provider);
}

// async function storeVCDirectly(vcId: number, currencyCode: any, amount: number, vcType: any, sigKeypairOwner: KeyringPair, provider: ApiPromise) {
//   let vcProperty = {
//     vcId,
//     currencyCode,
//     amount,
//   };
//   let owner = TEST_DAVE_DID;
//   let issuers = [
//     TEST_DAVE_DID,
//   ];
//   let vcHex = await vc.generateVC(vcProperty, owner, issuers, vcType, sigKeypairOwner, provider);
//   await vc.storeVC(vcHex, sigKeypairOwner, provider)
// }

async function sudoStoreVC(vcHex: string, sudoKeyPair: KeyringPair, provider: ApiPromise) {
    const tx = provider.tx.sudo.sudo(provider.tx.vc.store(vcHex));
    const nonce = await provider.rpc.system.accountNextIndex(sudoKeyPair.address);
    const signedTx = await tx.signAsync(sudoKeyPair, { nonce });
    return submitTransaction(signedTx, provider);
}

export {
  removeDid,
  councilStoreVC,
  // storeVCDirectly,
  sudoStoreVC,
}