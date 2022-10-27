import * as assert from 'assert';
import * as vc from '../src/vc';
import * as did from '../src/did';
import { initKeyring, SSID_BASE_URL } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import * as utils from '../src/utils';
import { removeDid, councilStoreVC} from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, Keyring } from '@polkadot/api';
import { HexString } from '@polkadot/util/types';
import { VCType } from '../src/utils';

describe('VC works correctly', () => {
  let sigKeypair: KeyringPair;
  const TEST_DID = 'did:ssid:rocket';
  const EVE_DID = 'did:ssid:eve';
  var provider: ApiPromise;
  let keyring: Keyring;
  let sigKeypairValidator: KeyringPair;
  let sigKeypairBob: KeyringPair;
  let signKeypairEve: KeyringPair;
  let signKeypairDave: KeyringPair;

  let actualHex: HexString;
  let ssidUrl: string;
  const TEST_DAVE_DID = "did:ssid:dave";
  const TEST_SWN_DID = "did:ssid:swn";

  let vc_id: HexString;

  before(async () => {
    keyring = await initKeyring();
    sigKeypair = keyring.addFromUri('//Alice');
    sigKeypairValidator = keyring.addFromUri('//Swn');
    provider = await buildConnection(constants.providerNetwork);
    ssidUrl = SSID_BASE_URL[constants.providerNetwork];
    sigKeypairBob = keyring.addFromUri('//Bob');
    signKeypairEve = keyring.addFromUri('//Eve');
    signKeypairDave = keyring.addFromUri('//Dave');
    vc_id = '0x';
  });

  it('VC is created in correct format', async () => {
    let tokenVC = {
      tokenName: 'test',
      reservableBalance: 1000,
      decimal: 6,
      currencyCode: 'OTH',
    };
    let owner = TEST_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    actualHex = await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypair);
    // console.log("Generated TokenVC Hex: \n", actualHex);
    let actualObject = utils.decodeHex(actualHex, 'VC');
    // console.log("Decoded TokenVC Object: \n", actualObject);
    let expectedObject = {
      hash: '0x1bfef48398ef3adcc90370f64c22d520ed45280455f6ef7df369005dd51989c7',
      owner: did.sanitiseDid(TEST_DID),
      issuers: [
        did.sanitiseDid(TEST_SWN_DID),
        did.sanitiseDid(EVE_DID)
      ],
      signatures: [''],
      is_vc_used: false,
      is_vc_active: false,
      vc_type: "TokenVC",
      vc_property: '0x7465737400000000000000000000000000ca9a3b000000000000000000000000064f54480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    };
    let expectedHex = '0x1bfef48398ef3adcc90370f64c22d520ed45280455f6ef7df369005dd51989c76469643a737369643a726f636b65740000000000000000000000000000000000086469643a737369643a73776e00000000000000000000000000000000000000006469643a737369643a657665000000000000000000000000000000000000000004c42aa9c5f8a29f40668e5aa696e83e0c6cc20fa090e4bb612b7ae9817812497656456b9cc05232e6a709c2ea7852fb9d2a666f1840cb7a0d2ed754c49e0ce98300007465737400000000000000000000000000ca9a3b000000000000000000000000064f54480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    assert.strictEqual(actualHex?.substring(0, 32), expectedHex.substring(0, 32));
    assert.strictEqual(actualObject.hash, expectedObject.hash);
    assert.strictEqual(actualObject.owner, expectedObject.owner);
    assert.deepEqual(actualObject.issuers, expectedObject.issuers);
    assert.strictEqual(actualObject.vc_property, expectedObject.vc_property);
  });

  it('Mint Token VC is created correctly', async () => {
    // console.log("///  Test Case 2 /// Mint TokenVC Creation");
    let vc_property = {
      vc_id: '0x33abedba92bb1acd284419f93e687590af928c268b633786e61b2f2c5635662d',
      currency_code: utils.encodeData('OTH'.padEnd(utils.CURRENCY_CODE_BYTES, '\0'), 'CurrencyCode'),
      amount: 1000
    }
    const vc_property_hex = utils.encodeData(vc_property, 'SlashMintTokens');
    const actual_vc_property = utils.decodeHex(vc_property_hex, 'SlashMintTokens');
    assert.strictEqual(vc_property.vc_id, actual_vc_property.vc_id);
    assert.strictEqual(vc_property.currency_code, actual_vc_property.currency_code);
    assert.strictEqual(vc_property.amount, actual_vc_property.amount);
  });

  
  it('Token VC creation fails token name is not given', async () => {
    let tokenVC = {
      reservableBalance: 1000,
    };
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    try {
      await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairValidator);
    } catch (e) {
      assert.strictEqual(e.message, "Token name is required");
    }
  });

  it('Token VC creation fails when token name length exceeds limit', async () => {
    let tokenVC = {
      tokenName: 'abcdefghijlkmnopq',
      reservableBalance: 1000,
      decimal: 6,
      currencyCode: 'OTH',
    };
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    try {
      await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairValidator);
    } catch (e) {
      assert.strictEqual(e.message, "Token name should not exceed 16 chars");
    }
  });

  it('Token VC creation fails when currency code is not valid', async () => {
    let tokenVC = {
      tokenName: 'test',
      reservableBalance: 1000,
      decimal: 6,
      currencyCode: 'abc'
    };
    let owner = TEST_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    try {
      await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairValidator);
    } catch (e) {
      assert.strictEqual(e.message, "Only Upper case characters with no space are allowed for currency code");
    }
    tokenVC.currencyCode = 'ABC12';
    try {
      await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairValidator);
    } catch (e) {
      assert.strictEqual(e.message, "Only Upper case characters with no space are allowed for currency code");
    }
    tokenVC.currencyCode = 'AB C ';
    try {
      await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairValidator);
    } catch (e) {
      assert.strictEqual(e.message, "Only Upper case characters with no space are allowed for currency code");
    }
  });

  it('Token VC creation fails when decimal is not given', async () => {
    let tokenVC = {
      tokenName: 'test',
      reservableBalance: 1000,
      currencyCode: 'ABC'
    };
    let owner = TEST_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    try {
      await vc.generateVC(tokenVC, owner, issuers, "TokenVC", sigKeypairValidator);
    } catch (e) {
      assert.strictEqual(e.message, "Decimal is required");
    }
  });

  it("Store Token VC and approve works correctly", async () => {
    let vcData: any;
    let tokenVC = {
      tokenName: 'test',
      reservableBalance: 1000,
      decimal: 6,
      currencyCode: 'OTH',
    };
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    const vcHex = await vc.generateVC(tokenVC, owner, issuers, VCType.TokenVC, sigKeypairValidator, provider, ssidUrl); // Sign with SWN
    const closedProposal = await councilStoreVC(vcHex, signKeypairDave, sigKeypair, sigKeypairValidator, provider);
    assert.doesNotReject(closedProposal);

    vc_id = closedProposal.events.vc.VCValidated.vcid;
    // console.log("VC ID: ", vc_id);
    vcData = await vc.getVCs(vc_id, provider);
    assert.strictEqual(vcData.isVcActive, false);

    assert.doesNotReject(await vc.approveVC(vc_id, signKeypairEve, provider, ssidUrl));

    vcData = await vc.getVCs(vc_id, provider);
    assert.strictEqual(vcData.vcType, VCType.TokenVC);
    assert.strictEqual(vcData.isVcActive, true);
  });

  it('Store and approve Generic VC works correctly', async () => {
    let genericVC = {
      cid: 'yD5HYVIgzl3_3Ze3fMgc',
    };
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    const vcHex = await vc.generateVC(genericVC, owner, issuers, "GenericVC", sigKeypairValidator, provider, ssidUrl); // SWN is also council member
    const transaction: any = await vc.storeVC(vcHex, sigKeypairValidator, provider);
    let vcId = transaction.events.vc.VCValidated.vcid;
    // console.log("VC ID: ", vcId);
    let apTxn: any = await vc.approveVC(vcId, signKeypairEve, provider, ssidUrl);
    assert.doesNotReject(transaction);
    assert.doesNotReject(apTxn);
    let data:any = await vc.getGenericVCData(vcId, ssidUrl, provider);
    // console.log("Data from getGenericVCData : ", data);
    let verifyData = await vc.verifyGenericVC(vcId, data.data, provider);
    assert.strictEqual(verifyData, true);
  });

  it('Get VC Ids by DID after storing VC works correctly', async () => {
    const vcs = await vc.getVCIdsByDID(TEST_DAVE_DID, provider);
    assert.strictEqual(vcs?.['length'] > 0, true);
  });

  it('Get VCs works correctly', async () => {
    const vcs = await vc.getVCs(vc_id, provider);
    assert.notStrictEqual(vcs, null);
  });

  it('Get DID by VC Id works correctly', async () => {
    const identifier = await vc.getDIDByVCId(vc_id, provider);
    assert.strictEqual(identifier, did.sanitiseDid(TEST_DAVE_DID));
  });

  it('Get VC history by VC ID works correctly', async () => {
    const vcHistory = await vc.getVCHistoryByVCId(vc_id, provider);
    assert.notStrictEqual(vcHistory, null);
  });

  it('Update status works correctly', async () => {
    const transaction: any = await vc.updateStatus(vc_id, false, signKeypairEve, provider);
    assert.doesNotReject(transaction);
    const vcs: any = await vc.getVCs(vc_id, provider);
    assert.strictEqual(vcs.isVcActive, false);
  });

  after(async () => {
    // Delete created DIDs
    if (constants.providerNetwork == 'local') {
      try {
        // await removeDid(TEST_DID, sigKeypair, provider);
        // await removeDid(EVE_DID, sigKeypair, provider);
        // await removeDid(TEST_DAVE_DID, sigKeypair, provider);
      } catch (err) { }
    }
  });
});
