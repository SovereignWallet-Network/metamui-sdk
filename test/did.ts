import assert from 'assert';
import * as did from '../src/did';
import * as vc from '../src/vc';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import { hexToString } from '../src/utils';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { removeDid } from './common/helper';
import { ApiPromise, Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { AnyJson } from '@polkadot/types/types';
import { utils } from '../src';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { VCType } from '../src/utils';

describe('DID Module works correctly', () => {
  const TEST_MNEMONIC =
    'trade tennis uncle hour cave wait stadium dove derive resemble attract relax';
  const TEST_METADATA = 'Metadata';
  const expectedPubkey =
    '74e2fd8dadfd06cc6cd6d22cf561b6693f6c138d4de8340a1e197384fcc3bc5b';
  const NEW_MNEMONIC =
    'strong offer usual inmate reform universe zero erode reopen mosquito blossom bachelor';
  const expectedNewPubkey =
    '04249359400f54ceb6ecf51edfeb1c02c8233e8ca563492df998a5d91266fa64';

  let sigKeypairWithBal: KeyringPair;
  let signKeypairFenn: KeyringPair;
  let signKeypairPublic: KeyringPair;
  let signKeypairPrivate: KeyringPair;
  let sigKeypair: KeyringPair;
  const TEST_DID = 'did:ssid:rocket';
  const EVE_DID = 'did:ssid:eve';
  var provider: ApiPromise;
  let keyring: Keyring;
  let sigKeypairValidator: KeyringPair;
  let sigKeypairBob: KeyringPair;
  let signKeypairEve: KeyringPair;
  let signKeypairDave: KeyringPair;
  let ssidUrl: string;
  const TEST_DAVE_DID = "did:ssid:dave";
  const TEST_SWN_DID = "did:ssid:swn";

  before(async () => {
    keyring = await initKeyring();
    provider = await buildConnection(constants.providerNetwork);
    sigKeypairWithBal = keyring.createFromUri(constants.mnemonicWithBalance);
    signKeypairFenn = keyring.addFromUri('//Fenn');
    signKeypairPublic = keyring.addFromUri('//Public');
    signKeypairPrivate = keyring.addFromUri('//Private');

  });


  it('DID is created in correct format', async () => {
    const didObj = await did.generateDID(TEST_MNEMONIC, TEST_DID, TEST_METADATA);
    assert.strictEqual(Buffer.from(didObj.private.public_key).toString('hex'), expectedPubkey);
    assert.strictEqual(didObj.private.identity, 'did:ssid:rocket');
    assert.strictEqual(didObj.private.metadata, TEST_METADATA);
  });

  it('DID details are fetched correctly - positive test', async () => {
    //  Alice is expected in the test chain
    const data: any = await did.getDIDDetails('did:ssid:swn', provider);
    assert.strictEqual(
      data.public_key,
      '0x3cf26ad9ca352503a6741faeb734307ef2554261086adf586bbe86fc2b34f574'
    );
    assert.strictEqual(
      data.identifier,
      did.sanitiseDid('did:ssid:swn')
    );
    assert.strictEqual(data.added_block, 0);
  });

  it('Resolve DID to account works correctly', async () => {
    //  Alice is expected in the test chain
    const data = await did.resolveDIDToAccount('did:ssid:swn', provider);
    assert.strictEqual(data, '5DSck4YHW17zNXFFVqMU3XF4Vi7b4zncWgai9nHFVmNS1QNC');
  });

  it('Resolve AccountID to DID works correctly', async () => {
    //  Alice is expected in the test chain
    const data = await did.resolveAccountIdToDid(
      '5DSck4YHW17zNXFFVqMU3XF4Vi7b4zncWgai9nHFVmNS1QNC',
      provider
    );
    assert.strictEqual(
      data,
      did.sanitiseDid('did:ssid:swn')
    );

    // return false for non existent did - this accountid is not expected to have a DID
    const data2 = await did.resolveAccountIdToDid(
      '5ES8sejoGKNyPgSpZFe5MdJCynKZcXTrukyjKM5vL2yxeY3r',
      provider
    );
    assert.strictEqual(data2, false);
  });

  it('Resolve DID to account at block number 0 works correctly', async () => {
    const data = await did.resolveDIDToAccount('did:ssid:swn', provider);
    // Alice's DID is created at block number 0
    assert.strictEqual(data, '5DSck4YHW17zNXFFVqMU3XF4Vi7b4zncWgai9nHFVmNS1QNC');
  });

  it('isDidValidator works correctly', async () => {
    //  Alice is expected in the test chain
    const data = await did.isDidValidator('did:ssid:swn', provider);
    assert.strictEqual(data, true);

    const data2 = await did.isDidValidator('did:ssid:mui-guru', provider);
    assert.strictEqual(data2, false);
  });

  it('updateMetadata works correctly', async () => {
    const data: any = await did.updateMetadata(
      'did:ssid:swn',
      'TestMetadata',
      sigKeypairWithBal,
      provider
    );
    assert.doesNotReject(data);
    const new_data: AnyJson = await did.getDIDDetails('did:ssid:swn', provider);
    assert.strictEqual(hexToString(new_data?.['metadata']), 'TestMetadata');
    assert.strictEqual(new_data?.['added_block'], 0);
  });

  it('updateMetadata throws error for unregistered DID', async () => {
    const data:any = await did.updateMetadata(
      'did:ssid:nonexistentdid',
      'TestMetadata',
      sigKeypairWithBal,
      provider
    );
    assert.rejects(data, (err: any) => {
      assert.strictEqual(err.message, 'did.DIDDoesNotExist');
      return true;
    });
  });

  it('sanitiseDid work correctly', async () => {
    const hex_did = did.sanitiseDid('did:ssid:swn');
    assert.strictEqual(
      hex_did,
      did.sanitiseDid('did:ssid:swn')
    );
  });

  it('generateMnemonic works correctly', async () => {
    const mnemonic = did.generateMnemonic();
    assert.strictEqual(mnemonicValidate(mnemonic), true);
  })

  // These test cases should only run in local environment
  if (constants.providerNetwork == 'local') {
    let addedDidBlockNum: number;
    let updatedKeyBlockNum: number;
    let testIdentifier = 'did:ssid:rocket';

    it.skip('PublicDidVC is created in correct format', async () => {
      let vc_property = {
        public_key: signKeypairPublic.publicKey,
        registration_number: "123456",
        company_name: 'Public Company',
        did: 'did:ssid:publicdid',
      };
      let owner = TEST_DAVE_DID; // did:ssid:dave
      let issuers = [
        TEST_SWN_DID, // did:ssid:swn
        EVE_DID, // did:ssid:eve
      ];
      const publicDidObj = await vc.generateVC(vc_property, owner, issuers, VCType.PublicDidVC, sigKeypairValidator);
      // console.log("Generated PublicDidVC Hex: \n", publicDidObj);
      const actualObject = utils.decodeHex(publicDidObj, "VC");
      // console.log("Decoded PublicDidVC Object: \n", actualObject);
      assert.strictEqual(utils.decodeHex(actualObject.vc_property, actualObject.vc_type).public_key, u8aToHex(vc_property.public_key));
      // console.log("decoded public did: \n",utils.decodeHex(actualObject.vc_property, actualObject.vc_type));
    });
  
  
    it.skip('Public VC is approved', async () => {
      let vc_property = {
        public_key: signKeypairPublic.publicKey,
        registration_number: "123456",
        company_name: 'Public Company',
        did: 'did:ssid:publicdid',
      };
      let owner = TEST_DAVE_DID;
      let issuers = [
        TEST_SWN_DID,
        EVE_DID,
      ];
      const publicDidObj = await vc.generateVC(vc_property, owner, issuers, VCType.PublicDidVC, sigKeypairValidator);
      let txnData = await vc.storeVC(publicDidObj, sigKeypairValidator, provider);
      let signVCTxn = await vc.approveVC(txnData.events.vc.VCValidated.vcid, signKeypairEve, provider);
      assert.doesNotReject(txnData);
      assert.doesNotReject(signVCTxn);
    });
  
    it.skip('PrivateDidVC is created in correct format', async () => {
      let owner = did.sanitiseDid(TEST_DAVE_DID);
      let vc_property = {
        public_key: signKeypairPrivate.publicKey,
        did: 'did:ssid:privatedid',
      };
      let issuers = [
        TEST_SWN_DID,
      ];
      const privateDidObj = await vc.generateVC(vc_property, owner, issuers, VCType.PrivateDidVC, sigKeypairValidator);
      const actualObject = utils.decodeHex(privateDidObj, "VC");
      assert.strictEqual(utils.decodeHex(actualObject.vc_property, actualObject.vc_type).public_key, u8aToHex(vc_property.public_key));
    });
  
    it.skip('Store PrivateDidVC works correctly', async () => {
      let owner = did.sanitiseDid("did:ssid:bob");
      let privateDidVCObj = {
        public_key: signKeypairFenn.publicKey,
        did: "did:ssid:fenn"
      };
      let issuers = [
        "did:ssid:swn",
        "did:ssid:alice"
      ];
      
      let BobHex = await vc.generateVC(privateDidVCObj, owner, issuers, "PrivateDidVC", sigKeypairValidator); // Validator Swn
      // console.log("BobHex: \n", BobHex);
      // console.log("Decoded BobHex: \n", utils.decodeHex(BobHex, "VC"));
      // console.log("Decoded Bob Hex  VC Property: \n", utils.decodeHex(utils.decodeHex(BobHex, "VC").vc_property, "PrivateDidVC"));
      const transaction: any = await vc.storeVC(BobHex, sigKeypair, provider);
      assert.doesNotReject(transaction);
    });

    it('storeDIDOnChain works correctly', async () => {
      const newDidObj = await did.generateDID(TEST_MNEMONIC, 'rocket', TEST_METADATA);
      if (typeof sigKeypairWithBal === 'undefined') return
      await did.storeDIDOnChain(newDidObj, sigKeypairWithBal, provider);
      const newDidDetails:any = await did.getDIDDetails(newDidObj.private.identity, provider);
      // console.log(newDidDetails);
      if (!newDidDetails) return null;
      addedDidBlockNum = newDidDetails['added_block'];
      // console.log("Added DID block number: ", addedDidBlockNum);
      assert.strictEqual(newDidDetails['public_key'], `0x${expectedPubkey}`);
      assert.strictEqual(newDidDetails['identifier'], did.sanitiseDid(testIdentifier));
      assert.strictEqual(hexToString(newDidDetails['metadata']), 'Metadata');
    });

    it('storeDIDOnChain throws error on duplicate ssid', async () => {
      const newDidObj = await did.generateDID(NEW_MNEMONIC, 'rocket', TEST_METADATA);
      if (typeof sigKeypairWithBal === 'undefined') return
      // const data = did.storeDIDOnChain(newDidObj, sigKeypairWithBal, provider);
      await assert.rejects(did.storeDIDOnChain(newDidObj, sigKeypairWithBal, provider), (err: any) => {
        assert.equal(err.message, 'did.DIDAlreadyExists');
        return true;
      });
    });

    it('storeDIDOnChain throws error on duplicate public key', async () => {
      const newDidObj = await did.generateDID(TEST_MNEMONIC, 'nonexistentdid', TEST_METADATA);
      if (typeof sigKeypairWithBal === 'undefined') return
      // const data = did.storeDIDOnChain(newDidObj, sigKeypairWithBal, provider);
      await assert.rejects(did.storeDIDOnChain(newDidObj, sigKeypairWithBal, provider), (err: any) => {
        assert.equal(err.message, 'did.PublicKeyRegistered');
        return true;
      });
    });

    it('updateDidKey works correctly', async () => {
      const didString = testIdentifier;

      assert(typeof keyring !== 'undefined', "Keyring is undefined");
      if (typeof keyring === 'undefined') return;

      const pubKey = keyring.createFromUri(NEW_MNEMONIC).publicKey;
      await did.updateDidKey(didString, pubKey, sigKeypairWithBal, provider);
      const newUpdatedDidDetails:any = await did.getDIDDetails(didString, provider);
      // console.log(newUpdatedDidDetails);
      updatedKeyBlockNum = newUpdatedDidDetails['added_block'];
      assert.strictEqual(newUpdatedDidDetails['public_key'], `0x${expectedNewPubkey}`);
      assert.strictEqual(newUpdatedDidDetails['identifier'], did.sanitiseDid(testIdentifier));
      const keyHistory:any = (await did.getDidKeyHistory(didString, provider));
      assert.equal(keyHistory
        && Array.isArray(keyHistory)
        && keyHistory.map(data => data[0]).includes('5EhxqnrHHFy32DhcaqYrWiwC82yDiVS4xySysGxsUn462nX2'), true);
    })

    it('updateDidKey throws error on using existing public key', async () => {
      const pubKey = keyring?.createFromUri(NEW_MNEMONIC).publicKey;
      // const data = did.updateDidKey(testIdentifier, pubKey, sigKeypairWithBal, provider);
      await assert.rejects(did.updateDidKey(testIdentifier, pubKey, sigKeypairWithBal, provider), (err: any) => {
        // console.log(err.message);
        assert.strictEqual(err.message, 'did.PublicKeyRegistered');
        return true;
      });
    });

    it('updateDidKey throws error on using non existent did', async () => {
      const pubKey = keyring?.createFromUri(TEST_MNEMONIC).publicKey;
      // const data = did.updateDidKey('did:ssid:nonexistentdid', pubKey, sigKeypairWithBal, provider);
      await assert.rejects(did.updateDidKey('did:ssid:nonexistentdid', pubKey, sigKeypairWithBal, provider), (err: any) => {
        // console.log(err.message);
        assert.strictEqual(err.message, 'did.DIDDoesNotExist');
        return true;
      });
    });

    it('Resolve test DID to account at block number 0 works correctly', async () => {
      const data:any = await did.resolveDIDToAccount(testIdentifier, provider, 0);
      // console.log(data);
      assert.strictEqual(data, null);
      return true;
    });

    it('Resolve DID to account after did created works correctly', async () => {
      // const prevAccBlockNumAcc = await did.resolveDIDToAccount(testIdentifier, provider, addedDidBlockNum-1);
      const creatAccBlockNumAcc = await did.resolveDIDToAccount(testIdentifier, provider, addedDidBlockNum);
      const nextBlockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, addedDidBlockNum ? addedDidBlockNum + 1 : 0);
      // assert.strictEqual(prevAccBlockNumAcc, null);
      assert.strictEqual(creatAccBlockNumAcc, '5EhxqnrHHFy32DhcaqYrWiwC82yDiVS4xySysGxsUn462nX2');
      assert.strictEqual(nextBlockNumberAcc, '5EhxqnrHHFy32DhcaqYrWiwC82yDiVS4xySysGxsUn462nX2');
    });

    it('Resolve DID to account after key updated works correctly', async () => {
      const prevBlockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, updatedKeyBlockNum ? updatedKeyBlockNum + (-1) : 0);
      const keyUpdateBlockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, updatedKeyBlockNum);
      const nextblockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, updatedKeyBlockNum ? updatedKeyBlockNum + 1 : 0);
      assert.strictEqual(prevBlockNumberAcc, '5EhxqnrHHFy32DhcaqYrWiwC82yDiVS4xySysGxsUn462nX2');
      assert.strictEqual(keyUpdateBlockNumberAcc, '5CA8uxffSzq2JyXVKXBudbgC3zBkQGzH2WUUf8ogBiJzxvFJ');
      assert.strictEqual(nextblockNumberAcc, '5CA8uxffSzq2JyXVKXBudbgC3zBkQGzH2WUUf8ogBiJzxvFJ');
    });
  }


  after(async () => {
    // Delete created DID (did:ssid:rocket)
    if (constants.providerNetwork == 'local') {
      await removeDid('did:ssid:rocket', sigKeypairWithBal, provider);
    }
  })
});