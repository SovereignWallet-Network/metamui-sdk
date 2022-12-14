import * as assert from 'assert';
import * as vc from '../src/vc';
import * as ledger from '../src/ledgers';
import { initKeyring } from '../src/config';
import { buildConnectionByUrl } from '../src/connection';
import * as constants from './common/constants';
import { sudoStoreVC } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, Keyring } from '@polkadot/api';
import { HexString } from '@polkadot/util/types';
import { VCType } from '../src/utils';
import { sanitiseDid } from '../src/did';

describe('Token works correctly', () => {
  let provider: ApiPromise;
  let relayProvider: ApiPromise;
  let keyring: Keyring;
  let sigKeypairValidator: KeyringPair;

  const TEST_SWN_DID = "did:ssid:swn";
  const TEST_BOB_DID = "did:ssid:bob";

  let vc_id: HexString;

  if (constants.providerNetwork == 'local') {

    before(async () => {
      keyring = await initKeyring();
      sigKeypairValidator = keyring.addFromUri(constants.mnemonicWithBalance);
      provider = await buildConnectionByUrl("ws://127.0.0.1:7744");
      relayProvider = await buildConnectionByUrl("ws://127.0.0.1:9944");
      vc_id = '0x';

      let tokenVC = {
        tokenName: 'Test',
        reservableBalance: 100,
        decimal: 2,
        currencyCode: 'XYZ',
      };
      let owner = TEST_SWN_DID;
      let issuers = [
        TEST_SWN_DID,
      ];
      const vcHex = await vc.generateVC(tokenVC, owner, issuers, VCType.TokenVC, sigKeypairValidator); // Sign with SWN
      const closedProposal = await sudoStoreVC(vcHex, sigKeypairValidator, provider);
      vc_id = closedProposal.events.vc.VCValidated.vcid;
      // console.log('TokenVC created with vc_id => ', vc_id);
    });

    it("Get token list works correctly", async () => {
      let tokenList = await ledger.getTokenList(provider);
      assert.notEqual(tokenList, null);
    });

    it('Issued a new currency correctly', async () => {
      let total_supply = 10000;
      const issueToken = await ledger.issueToken(vc_id, total_supply, sigKeypairValidator, provider, relayProvider);
      assert.doesNotReject(issueToken);
    });

    it('Get Balance for tokens works correctly', async () => {
      let currencyCode = 'XYZ';
      let did = TEST_SWN_DID;
      let balance = await ledger.getBalance(did, currencyCode, provider);
      assert.equal(balance, 10000);
      let detailedBalance: any = await ledger.getDetailedBalance(did, currencyCode, provider);
      assert.equal(detailedBalance.free, 1000000);
    });

    it('Mint Token VC is stored correctly', async () => {
      let vc_property = {
        vc_id,
        currencyCode: 'XYZ',
        amount: 10
      }
      let owner = TEST_SWN_DID;
      let issuers = [
        TEST_SWN_DID
      ];

      let vcHex = await vc.generateVC(vc_property, owner, issuers, VCType.MintTokens, sigKeypairValidator);
      let txn = await vc.storeVC(vcHex, sigKeypairValidator, provider);
      let mint_vc_id = txn.events.vc.VCValidated.vcid;
      let mintToken = await ledger.mintToken(mint_vc_id, sigKeypairValidator, provider);
      assert.doesNotReject(mintToken);
    });

    it('Transfer Token VC works created correctly', async () => {
      let vc_property = {
        vc_id,
        currencyCode: 'XYZ',
        amount: 5,
      }
      let owner = TEST_SWN_DID;
      let issuers = [
        TEST_SWN_DID
      ];

      let vcHex = await vc.generateVC(vc_property, owner, issuers, VCType.TokenTransferVC, sigKeypairValidator);
      let txn = await vc.storeVC(vcHex, sigKeypairValidator, provider);
      let transfer_vc_id = txn.events.vc.VCValidated.vcid;
      let transferToken = await ledger.transferToken(transfer_vc_id, TEST_BOB_DID, sigKeypairValidator, provider);
      assert.doesNotReject(transferToken);
    });

    it('Transfer between dids works correctly', async () => {
      let currencyCode = 'XYZ';
      let dest_did = sanitiseDid(TEST_BOB_DID);
      let transfer = await ledger.transfer(dest_did, currencyCode, 10, sigKeypairValidator, provider);
      assert.doesNotReject(transfer);
    });

    it('Transfer token with memo works correctly', async () => {
      let currencyCode = 'XYZ';
      let dest_did = sanitiseDid(TEST_BOB_DID);
      let memo = 'test transaction';
      let transferWithMemo = await ledger.transferTokenWithMemo(dest_did, currencyCode, 10, memo, sigKeypairValidator, provider);
      assert.doesNotReject(transferWithMemo);
    });

    it('Set balance for token works correctly', async () => {
      let currencyCode = 'XYZ';
      let balance = 100;
      let dest_did = sanitiseDid(TEST_BOB_DID);
      let setBalance = await ledger.setBalance(dest_did, currencyCode, balance, sigKeypairValidator, provider);
      assert.doesNotReject(setBalance);
    });

    it('Slash Token VC works created correctly', async () => {
      let vc_property = {
        vc_id,
        currencyCode: 'XYZ',
        amount: 1000,
      };
      let owner = TEST_SWN_DID;
      let issuers = [
        TEST_SWN_DID
      ];

      let vcHex = await vc.generateVC(vc_property, owner, issuers, VCType.SlashTokens, sigKeypairValidator);
      let txn = await vc.storeVC(vcHex, sigKeypairValidator, provider);
      let slash_vc_id = txn.events.vc.VCValidated.vcid;
      let slashToken = await ledger.slashToken(slash_vc_id, sigKeypairValidator, provider);
      assert.doesNotReject(slashToken);
    });
    
    it('Transfer all works correctly', async () => {
      let currencyCode = 'XYZ';
      let dest_did = sanitiseDid(TEST_BOB_DID);
      let transferAll = await ledger.transferAll(dest_did, currencyCode, sigKeypairValidator, provider);
      assert.doesNotReject(transferAll);
    });

    it('Remove Token works correctly', async () => {
      let currencyCode = 'XYZ';
      let fromDid = sanitiseDid(TEST_BOB_DID);
      let removeToken = await ledger.removeToken(currencyCode, vc_id, fromDid, sigKeypairValidator, provider);
      assert.doesNotReject(removeToken);
    });
  }
});
