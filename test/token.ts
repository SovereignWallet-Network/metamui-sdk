import * as assert from 'assert';
import * as vc from '../src/vc';
import * as token from '../src/token';
import * as did from '../src/did';
import { initKeyring, SSID_BASE_URL } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import * as utils from '../src/utils';
import { sudoStoreVC, councilVoteTxn } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, Keyring } from '@polkadot/api';
import { HexString } from '@polkadot/util/types';
import { VCType } from '../src/utils';

describe('VC works correctly', () => {
  let sigKeypair: KeyringPair;
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
  const TEST_BOB_DID = "did:ssid:bob";

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

    let tokenVC = {
      tokenName: 'MUI',
      reservableBalance: 1000,
      decimal: 6,
      currencyCode: 'MUI',
    };
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_SWN_DID,
      EVE_DID,
    ];
    const vcHex = await vc.generateVC(tokenVC, owner, issuers, VCType.TokenVC, sigKeypairValidator, provider); // Sign with SWN
    const closedProposal = await sudoStoreVC(vcHex, sigKeypair, provider);
    vc_id = closedProposal.events.vc.VCValidated.vcid;
    await vc.approveVC(vc_id, signKeypairEve, provider, ssidUrl);
  });

  it('Mint Token VC is created correctly', async () => {
    // console.log("///  Test Case 2 /// Mint TokenVC Creation");
    let vc_property = {
      vc_id,
      amount: 1000
    }
    const vc_property_hex = utils.encodeData(vc_property, 'SlashMintTokens');
    const actual_vc_property = utils.decodeHex(vc_property_hex, 'SlashMintTokens');
    assert.strictEqual(vc_property.vc_id, actual_vc_property.vc_id);
    assert.strictEqual(vc_property.amount, actual_vc_property.amount);
  });

  it('Mint Token VC is stored correctly', async () => {
    let vc_property = {
      vc_id,
      amount: 1000
    }
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_DAVE_DID
    ];

    let vcHex = await vc.generateVC(vc_property, owner, issuers, VCType.MintTokens, signKeypairDave, provider);
    let txn = await vc.storeVC(vcHex, sigKeypairValidator, provider);
    let mint_vc_id = txn.events.vc.VCValidated.vcid;
    let mintToken = await token.mintToken(mint_vc_id, signKeypairDave, provider);
    assert.doesNotReject(mintToken);
  });

  it('Transfer Token VC works created correctly', async () => {
    let vc_property = {
      vc_id,
      amount: 50,
    }
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_DAVE_DID
    ];

    let vcHex = await vc.generateVC(vc_property, owner, issuers, VCType.TokenTransferVC, signKeypairDave, provider);
    let txn = await vc.storeVC(vcHex, sigKeypairValidator, provider);
    let transfer_vc_id = txn.events.vc.VCValidated.vcid;
    let transferToken = await token.transferToken(transfer_vc_id, TEST_BOB_DID, signKeypairDave, provider);
    assert.doesNotReject(transferToken);
  });

  it('Slash Token VC works created correctly', async () => {
    let vc_property = {
      vc_id,
      amount: 50,
    };
    let owner = TEST_DAVE_DID;
    let issuers = [
      TEST_DAVE_DID
    ];

    let vcHex = await vc.generateVC(vc_property, owner, issuers, VCType.SlashTokens, signKeypairDave, provider);
    let txn = await vc.storeVC(vcHex, sigKeypairValidator, provider);
    let slash_vc_id = txn.events.vc.VCValidated.vcid;
    let slashToken = await token.slashToken(slash_vc_id, signKeypairDave, provider);
    assert.doesNotReject(slashToken);
  });

  it('Withdraw reserved works correctly', async () => {
    let toDid = "did:ssid:bob";
    let fromDid = "did:ssid:dave";
    let amount = 100;
    let call = provider.tx.token.withdrawReserved(did.sanitiseDid(toDid), did.sanitiseDid(fromDid), amount);
    let txn = await councilVoteTxn(call, signKeypairDave, sigKeypair, sigKeypairValidator, provider);
    assert.doesNotReject(txn);
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
