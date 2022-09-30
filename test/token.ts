import assert from 'assert';
import * as token from '../src/token';
import * as tx from '../src/transaction';
import * as vc from '../src/vc';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './test_constants';
import { expect } from 'chai';
import * as did from '../src/did';
import { hexToString, encodeData, CURRENCY_CODE_BYTES } from '../src/utils';
import { removeDid, sudoStoreVC, storeVCDirectly } from './helper/helper';
import { of } from 'rxjs';

describe('Token Module works correctly', () => {
  let sigKeypairRoot: any = null;
  let signKeypairOrgA;
  let sigKeypairMeta;
  let provider: any = null;
  let from = null;
  let keyring;
  const TEST_META_DID = 'did:ssid:rocket';
  const TEST_ORG_A_DID = "did:ssid:dave";
  const TEST_SWN_DID = "did:ssid:swn";

  before(async () => {
    keyring = await initKeyring();
    provider = await buildConnection(constants.providerNetwork);
    sigKeypairRoot = await keyring.createFromUri(constants.mnemonicWithBalance);
    signKeypairOrgA = await keyring.createFromUri("//Dave");
    from = sigKeypairRoot.address;
  });

  // These test cases should only run in local environment
  if (constants.providerNetwork == 'local') {
    let vcId;
    let currencyCode;

    before(async () => {
      if (constants.providerNetwork == 'local') {
        sigKeypairMeta = await keyring.createFromUri('//Bob');
        const didObj = {
          private: {
            public_key: sigKeypairMeta.publicKey, // this is the public key linked to the did
            identity: TEST_META_DID, // this is the actual did
            metadata: 'Metadata',
          }
        };
        try {
          await did.storeDIDOnChain(didObj, sigKeypairRoot, provider);
        } catch (err) { }
        await tx.sendTransaction(sigKeypairRoot, TEST_META_DID, 20000000, provider);
        const didObjDave = {
          private: {
            public_key: signKeypairOrgA.publicKey, // this is the public key linked to the did
            identity: TEST_ORG_A_DID, // this is the actual did
            metadata: 'Metadata',
          }
        };
        try {
          await did.storeDIDOnChain(didObjDave, sigKeypairRoot, provider);
        } catch (err) { }
        await tx.sendTransaction(sigKeypairRoot, TEST_ORG_A_DID, 20000000, provider);

        currencyCode = 'OTH';
        let tokenVC = {
          tokenName: 'Org_A',
          reservableBalance: 0.01,
          decimal: 6,
          currencyCode,
        };
        let owner = TEST_ORG_A_DID;
        let issuers = [
          TEST_META_DID,
        ];
        try {
          const vcHex = await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairMeta);
          await sudoStoreVC(vcHex, sigKeypairRoot, provider);
        } catch (err) {
          console.log(err);
        }
        vcId = (await vc.getVCIdsByDID(TEST_ORG_A_DID))?.[0];
      }
    });

    it('Token Issuance works correctly', async () => {
      const transfer: any = await token.issueToken(
        vcId,
        10000000,
        signKeypairOrgA,
        provider,
      );
      assert.doesNotReject(transfer);
    });

    it('Get tokens list works correctly', async () => {
      let tokensList = await token.getTokenList(provider);
      tokensList.forEach(item => {
        expect(item).to.haveOwnProperty('name');
        expect(item).to.haveOwnProperty('currencyCode');
        expect(item).to.haveOwnProperty('decimal');
        expect(item).to.haveOwnProperty('blockNumber');
      });
    });

    it('Get Token Balance works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_ORG_A_DID, currencyCode, provider);
      assert.strictEqual(balance, 10);
    });

    it('Subscribed Token Balance works correctly', (done) => {
      let isCallbackCalled = false;
      token.subscribeToGetTokenBalance(TEST_ORG_A_DID, currencyCode, (balance) => {
        if (isCallbackCalled) return;
        isCallbackCalled = true;
        assert.strictEqual(balance, 10);
        done();
      }, provider);
    });

    it('Get Detailed Token Balance works correctly', async () => {
      let balance = await token.getDetailedTokenBalance(TEST_ORG_A_DID, currencyCode, provider);
      assert.strictEqual(balance.free, 10);
      assert.strictEqual(balance.reserved, 0);
      assert.strictEqual(balance.frozen, 0);
    });

    it('Subscribed Detailed Token Balance works correctly', (done) => {
      let isCallbackCalled = false;
      token.subscribeToGetDetailedTokenBalance(TEST_ORG_A_DID, currencyCode, (balance) => {
        if (isCallbackCalled) return;
        isCallbackCalled = true;
        assert.strictEqual(balance.free, 10);
        assert.strictEqual(balance.reserved, 0);
        assert.strictEqual(balance.frozen, 0);
        done();
      }, provider);
    });

    it('Get tokens total supply works correctly', async () => {
      let tokensSupply = await token.getTokenTotalSupply(currencyCode, provider);
      assert.strictEqual(tokensSupply, 10);
    });

    it('Get locks works correctly', async () => {
      let locks = await token.getLocks(TEST_META_DID, currencyCode, provider);
      of(typeof locks === 'number')
      assert.strictEqual(locks, 0);
    });

    it('Get token issuer works correctly', async () => {
      let issuer = await token.getTokenIssuer(currencyCode, provider);
      const decodeIssuer = hexToString(issuer);
      assert.strictEqual(decodeIssuer, TEST_ORG_A_DID);
    });

    it('Mint Token works correctly', async () => {
      await storeVCDirectly(vcId, currencyCode, 1, "MintTokens", signKeypairOrgA, provider);
      let mintVcId = (await vc.getVCIdsByDID(TEST_ORG_A_DID))?.[1];
      const transaction: any = await token.mintToken(mintVcId, signKeypairOrgA, provider);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after mint token works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_ORG_A_DID, currencyCode, provider);
      assert.strictEqual(balance, 11);
    });

    it('Withdraw from treasury works correctly', async () => {
      const data: any = await token.withdrawTreasuryReserve(TEST_SWN_DID, TEST_META_DID, 10000, sigKeypairMeta, provider);
      assert.doesNotReject(data);
    });

    it('Slash Token works correctly', async () => {
      await storeVCDirectly(vcId, currencyCode, 1, "SlashTokens", signKeypairOrgA, provider);
      let slashVcId = (await vc.getVCIdsByDID(TEST_ORG_A_DID))?.[2];
      const transaction: any = await token.slashToken(slashVcId, signKeypairOrgA, provider);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after slash token works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_ORG_A_DID, currencyCode, provider);
      assert.strictEqual(balance, 10);
    });

    it('Transfer Token With VC works correctly', async () => {
      await storeVCDirectly(vcId, currencyCode, 1, "TokenTransferVC", signKeypairOrgA, provider);
      let transferVCId = (await vc.getVCIdsByDID(TEST_ORG_A_DID))?.[3];
      const transaction: any = await token.transferTokenWithVC(transferVCId, TEST_SWN_DID, signKeypairOrgA, provider);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after transfer token with vc works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_SWN_DID, currencyCode, provider);
      assert.strictEqual(balance, 1);
    });

    it('Token transfer works correctly', async () => {
      const transaction: any = await token.transferToken(TEST_SWN_DID, currencyCode, 0.01, signKeypairOrgA, provider);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after transfer works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_SWN_DID, currencyCode, provider);
      assert.strictEqual(balance, 1.01);
    });

    it('Token transfer with memo works correctly', async () => {
      const transaction: any = await token.transferTokenWithMemo(TEST_SWN_DID, currencyCode, 0.01, 'Tested Memo', signKeypairOrgA, provider);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after transfer with memo works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_SWN_DID, currencyCode, provider);
      assert.strictEqual(balance, 1.02);
    });

    it('Token transfer all works correctly', async () => {
      const transaction: any = await token.transferAll(TEST_SWN_DID, currencyCode, signKeypairOrgA, provider);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after transfer all works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_SWN_DID, currencyCode, provider);
      assert.strictEqual(balance, 10);
    });

    it('Token set balance works correctly', async () => {
      const transaction: any = await token.setBalance(TEST_SWN_DID, currencyCode, 0.01, signKeypairOrgA, provider, null);
      assert.doesNotReject(transaction);
    });

    it('Get Token Balance after transfer works correctly', async () => {
      let balance = await token.getTokenBalance(TEST_SWN_DID, currencyCode, provider);
      assert.strictEqual(balance, 0.01);
    });

    it('Tokens total supply is unchanged', async () => {
      let tokensSupply = await token.getTokenTotalSupply(currencyCode, provider);
      assert.strictEqual(tokensSupply, 10);
    });

    it('Remove Token works correctly', async () => {
      let transaction: any = await token.removeToken(currencyCode, vcId, true, sigKeypairRoot, null, provider);
      assert.doesNotReject(transaction);
    });
  }


  after(async () => {
    // Delete created DID
    if (constants.providerNetwork == 'local') {
      await removeDid(TEST_META_DID, sigKeypairRoot, provider);
      await removeDid(TEST_ORG_A_DID, sigKeypairRoot, provider);
    }
  });
});
