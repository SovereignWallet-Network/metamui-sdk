import assert from 'assert';

import * as collective from '../src/collective';
import * as did from '../src/did';
import * as tx from '../src/balances';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import { removeDid } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise } from '@polkadot/api';

describe('Collective works correctly', () => {
  let provider: ApiPromise;
  let newMembers;
  let proposalHash;
  let index;
  let sudoKey;
  const TEST_EVE_DID = "did:ssid:eve";
  const TEST_DAVE_DID = "did:ssid:dave";
  const TEST_SWN_DID = "did:ssid:swn";
  const vcHex = '0x5b8a94cff2bda887fe464cb77ac57059d410b4cc99a78d66ea8d768ca3ab8b956469643a737369643a6461766500000000000000000000000000000000000000086469643a737369643a73776e00000000000000000000000000000000000000006469643a737369643a6576650000000000000000000000000000000000000000044203e97dc9c9e0d0f7ffae32e253f72403a3fc97df9e9f43e1af02cb6893ce505355e7fed4b6db7f21a84851b87480e64f5f4ae691153f1f540992180dffc3870000007465737400000000000000000000000000ca9a3b000000000000000000000000064f54480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
  let sigKeyPairSwn: KeyringPair;
  let sigKeypairDave: KeyringPair;
  let sigKeyPairEve: KeyringPair;
  let sudoPair: KeyringPair;

  if (constants.providerNetwork == 'local') {
    before(async () => {
      provider = await buildConnection(constants.providerNetwork);
      let keyring = await initKeyring();
      sudoKey = await provider.query.sudo.key();
      sudoPair = keyring.addFromUri('//Alice');
      sigKeyPairSwn = keyring.addFromUri('//Swn');
      sigKeyPairEve = keyring.addFromUri('//Eve');
      sigKeypairDave = keyring.addFromUri('//Dave');
    });

    it('should set members correctly', async () => {
      newMembers = [
        TEST_DAVE_DID,
        TEST_EVE_DID,
        TEST_SWN_DID,
      ]
      let transaction: any = await collective.setMembers(newMembers, TEST_SWN_DID, 0, sudoPair, provider);
      assert.doesNotReject(transaction);
    });

    it('should get members correctly', async () => {
      const expectedMembers = [
        did.sanitiseDid(TEST_DAVE_DID),
        did.sanitiseDid(TEST_EVE_DID),
        did.sanitiseDid(TEST_SWN_DID),
      ];
      const actualMembers = await collective.getMembers(provider);
      assert.strictEqual(actualMembers?.[0], expectedMembers[0]);
      assert.strictEqual(actualMembers?.[1], expectedMembers[1]);
      assert.strictEqual(actualMembers?.[2], expectedMembers[2]);
    });

    it('should get prime correctly', async () => {
      const expectedPrime = did.sanitiseDid(TEST_SWN_DID);
      const actualPrime = await collective.getPrime(provider);
      assert.strictEqual(actualPrime, expectedPrime);
    });

    it('should set proposals correctly', async () => {
      const call = provider.tx.vc.store(vcHex);
      let transaction: any = await collective.propose(3, call, 1000, sigKeyPairEve, provider);
      proposalHash = transaction.events.council.Proposed.proposalHash;
      assert.doesNotReject(transaction);
    });

    it('should get proposals', async () => {
      const actualProposals = await collective.getProposals(provider);
      let vote = await collective.getVotes(proposalHash, provider);
      if (vote == null) {
        return
      }
      index = vote[index];
      if (typeof actualProposals === 'number')
        assert.strictEqual(actualProposals > 0, true);
    });

    it('should get proposal correctly', async () => {
      let proposalHex: any = await collective.getProposalOf(proposalHash, provider);
      assert.strictEqual(proposalHex.args.vc_hex, vcHex);
    });

    it('should get proposal count correctly', async () => {
      let proposalCount = await collective.getProposalCount(provider);
      assert.strictEqual(proposalCount, 1);
    });

    it('should vote correctly', async () => {
      let swnTransaction: any = await collective.vote(proposalHash, index, true, sigKeyPairSwn, provider);
      assert.doesNotReject(swnTransaction);
      
      let eveTransaction: any = await collective.vote(proposalHash, index, true, sigKeyPairEve, provider);
      assert.doesNotReject(eveTransaction);

      let daveTransaction: any = await collective.vote(proposalHash, index, false, sigKeypairDave, provider);
      assert.doesNotReject(daveTransaction);

    });

    it('should get votes correctly', async () => {
      let voteCount = await collective.getVotes(proposalHash, provider);
      assert.strictEqual(voteCount?.['ayes'].length, 2);
      assert.strictEqual(voteCount?.['nays'].length, 1);
      assert.strictEqual(voteCount?.['ayes'].includes(did.sanitiseDid(TEST_SWN_DID)), true);
      assert.strictEqual(voteCount?.['ayes'].includes(did.sanitiseDid(TEST_EVE_DID)), true);
      assert.strictEqual(voteCount?.['nays'].includes(did.sanitiseDid(TEST_DAVE_DID)), true);
    });

    it('should close proposal correctly', async () => {
      let transaction: any = await collective.close(proposalHash, index, 1000, 1000, sudoPair, provider);
      assert.doesNotReject(transaction);
    });

    // Even though call is rejected with Bad Origin Err, collective execution is succesfull
    it.skip('should not execute proposal correctly', async () => {
      const call = provider.tx.vc.store(vcHex);
      let transaction = await collective.execute(call, 1000, sigKeypairDave, provider);
      console.log('transaction: ', transaction);
      assert.rejects(transaction);
    });

    it('should disapprove proposal correctly', async () => {
      const call = provider.tx.vc.store(vcHex);
      let proposal = await collective.propose(3, call, 1000, sigKeyPairEve, provider);
      proposalHash = proposal.events.council.Proposed.proposalHash;
      let transaction: any = await collective.disapproveProposal(proposalHash, sudoPair, provider);
      assert.doesNotReject(transaction);
    });

    after(async () => {
      // Delete created DID (did:ssid:rocket)
      if (constants.providerNetwork == 'local') {
        // await removeDid(TEST_ROCKET_DID, sudoPair, provider);
        // await removeDid(TEST_DAVE_DID, sudoPair, provider);
      }
    })
  }
});