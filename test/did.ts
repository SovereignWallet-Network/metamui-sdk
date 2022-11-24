import assert from 'assert';
import * as did from '../src/did';
import * as vc from '../src/vc';
import { initKeyring } from '../src/config';
import { buildConnection } from '../src/connection';
import * as constants from './common/constants';
import { hexToString } from '../src/utils';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { ApiPromise, Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { AnyJson } from '@polkadot/types/types';
import { utils } from '../src';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { VCType } from '../src/utils';
import { HexString } from '@polkadot/util/types';

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

  let signKeypairFenn: KeyringPair;
  let signKeypairPublic: KeyringPair;
  let signKeypairPrivate: KeyringPair;
  let sigKeypair: KeyringPair;
  const EVE_DID = 'did:ssid:eve';
  let provider: ApiPromise;
  let keyring: Keyring;
  let sigKeypairValidator: KeyringPair;
  let signKeypairEve: KeyringPair;
  let signKeypairTemp: KeyringPair;
  const TEST_DAVE_DID = "did:ssid:dave";
  const TEST_SWN_DID = "did:ssid:swn";
  let vcId: HexString = '0x';

  before(async () => {
    keyring = await initKeyring();
    provider = await buildConnection(constants.providerNetwork);
    sigKeypair = keyring.addFromUri('//Alice');
    sigKeypairValidator = keyring.addFromUri(constants.mnemonicWithBalance);
    signKeypairEve = keyring.addFromUri('//Eve');
    signKeypairFenn = keyring.addFromUri('//Fenn');
    signKeypairPublic = keyring.addFromUri('//Public');
    signKeypairPrivate = keyring.addFromUri('//Private');
    signKeypairTemp = keyring.addFromUri('//Temp');
  });

  it('PublicDidVC is created in correct format', async () => {
    let vc_property = {
      public_key: signKeypairPublic.publicKey,
      registration_number: "123456",
      company_name: 'Public Company',
      did: 'did:ssid:publicdid',
    };
    let owner = TEST_SWN_DID;
    let issuers = [
      TEST_SWN_DID
    ];
    const publicDidObj = await vc.generateVC(vc_property, owner, issuers, VCType.PublicDidVC, sigKeypairValidator);
    const actualObject = utils.decodeHex(publicDidObj, "VC");
    assert.strictEqual(utils.decodeHex(actualObject.vc_property, actualObject.vc_type).public_key, u8aToHex(vc_property.public_key));
  });

  it('PrivateDidVC is created in correct format', async () => {
    let owner = did.sanitiseDid(TEST_SWN_DID);
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

  it('isDidValidator works correctly', async () => {
    const data = await did.isDidValidator('did:ssid:swn', provider);
    assert.strictEqual(data, true);

    const data2 = await did.isDidValidator('did:ssid:mui-guru', provider);
    assert.strictEqual(data2, false);
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
    let testIdentifier = 'did:ssid:fenn';
  

    it('DID details are fetched correctly - positive test', async () => {
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
      const data = await did.resolveDIDToAccount('did:ssid:swn', provider);
      assert.strictEqual(data, '5DSck4YHW17zNXFFVqMU3XF4Vi7b4zncWgai9nHFVmNS1QNC');
    });
  
    it('Resolve AccountID to DID works correctly', async () => {
      const data = await did.resolveAccountIdToDid(
        '5DSck4YHW17zNXFFVqMU3XF4Vi7b4zncWgai9nHFVmNS1QNC',
        provider
      );
      assert.strictEqual(
        data,
        did.sanitiseDid('did:ssid:swn')
      );
  
      const data2 = await did.resolveAccountIdToDid(
        '5ES8sejoGKNyPgSpZFe5MdJCynKZcXTrukyjKM5vL2yxeY3r',
        provider
      );
      assert.strictEqual(data2, false);
    });
  
    it('Resolve DID to account at block number 0 works correctly', async () => {
      const data = await did.resolveDIDToAccount('did:ssid:swn', provider);
      assert.strictEqual(data, '5DSck4YHW17zNXFFVqMU3XF4Vi7b4zncWgai9nHFVmNS1QNC');
    });

    it('updateMetadata works correctly', async () => {
      const data: any = await did.updateMetadata(
        'did:ssid:swn',
        'TestMetadata',
        sigKeypairValidator,
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
        sigKeypairValidator,
        provider
      );
      assert.rejects(data, (err: any) => {
        assert.strictEqual(err.message, 'did.DIDDoesNotExist');
        return true;
      });
    });

    it('Store PublicDid works correctly', async () => {
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
      assert.doesNotReject(txnData);
      let publicVcId = txnData.events.vc.VCValidated.vcid;
      let signVCTxn = await vc.approveVC(txnData.events.vc.VCValidated.vcid, signKeypairEve, provider);
      assert.doesNotReject(signVCTxn);
      let createPublicTxn = await did.createPublic(publicVcId, null, sigKeypairValidator, provider);
      assert.doesNotReject(createPublicTxn);
      const newDidDetails:any = await did.getDIDDetails(vc_property.did, provider);
      if (!newDidDetails) return null;
      assert.strictEqual(newDidDetails.public_key, u8aToHex(signKeypairPublic.publicKey));
      assert.strictEqual(newDidDetails.identifier, did.sanitiseDid(vc_property.did));
    });
  
    it('Store PrivateDid works correctly', async () => {
      let owner = did.sanitiseDid("did:ssid:bob");
      let privateDidVCObj = {
        public_key: signKeypairFenn.publicKey,
        did: "did:ssid:fenn"
      };
      let issuers = [
        "did:ssid:swn",
        "did:ssid:alice"
      ];
      
      let vcHex = await vc.generateVC(privateDidVCObj, owner, issuers, "PrivateDidVC", sigKeypairValidator); // Validator Swn
      const transaction: any = await vc.storeVC(vcHex, sigKeypairValidator, provider);
      assert.doesNotReject(transaction);
      vcId = transaction.events.vc.VCValidated.vcid;
      assert.doesNotReject(await vc.approveVC(vcId, sigKeypair, provider));
      let createPrivateTxn: any = await did.createPrivate(vcId, null, sigKeypairValidator, provider);
      assert.doesNotReject(createPrivateTxn);
      const newDidDetails:any = await did.getDIDDetails(privateDidVCObj.did, provider);
      if (!newDidDetails) return null;
      addedDidBlockNum = newDidDetails.added_block;
      assert.strictEqual(newDidDetails.public_key, u8aToHex(privateDidVCObj.public_key));
      assert.strictEqual(newDidDetails.identifier, did.sanitiseDid(privateDidVCObj.did));
    });

    it('create PrivateDid throws error on duplicate did', async () => {
      let owner = did.sanitiseDid("did:ssid:ferdie");
      let privateDidVCObj = {
        public_key: signKeypairTemp.publicKey,
        did: "did:ssid:fenn"
      };
      let issuers = [
        "did:ssid:swn"
      ];
      let vcHex = await vc.generateVC(privateDidVCObj, owner, issuers, "PrivateDidVC", sigKeypairValidator); // Validator Swn
      const transaction: any = await vc.storeVC(vcHex, sigKeypairValidator, provider);
      assert.doesNotReject(transaction);
      let tempVc = transaction.events.vc.VCValidated.vcid;
      await assert.rejects(did.createPrivate(tempVc, null, sigKeypairValidator, provider), (err: any) => {
        assert.equal(err.message, 'did.DIDAlreadyExists');
        return true;
      });
    });

    it('storeDID VC throws error on duplicate public key', async () => {
      let owner = did.sanitiseDid("did:ssid:ferdie");
      let privateDidVCObj = {
        public_key: signKeypairFenn.publicKey,
        did: "did:ssid:tempdid"
      };
      let issuers = [
        "did:ssid:swn"
      ];
      let vcHex = await vc.generateVC(privateDidVCObj, owner, issuers, "PrivateDidVC", sigKeypairValidator); // Validator Swn
      await assert.rejects(vc.storeVC(vcHex, sigKeypairValidator, provider), (err: any) => {
        assert.equal(err.message, 'vc.PublicKeyRegistered');
        return true;
      });
    });

    it('updateDidKey works correctly', async () => {
      const didString = testIdentifier;

      assert(typeof keyring !== 'undefined', "Keyring is undefined");
      if (typeof keyring === 'undefined') return;

      const pubKey = keyring.createFromUri(NEW_MNEMONIC).publicKey;
      await did.updateDidKey(didString, pubKey, null, sigKeypairValidator, provider);
      const newUpdatedDidDetails:any = await did.getDIDDetails(didString, provider);
      updatedKeyBlockNum = newUpdatedDidDetails['added_block'];
      assert.strictEqual(newUpdatedDidDetails['public_key'], `0x${expectedNewPubkey}`);
      assert.strictEqual(newUpdatedDidDetails['identifier'], did.sanitiseDid(testIdentifier));
      const keyHistory:any = (await did.getDidKeyHistory(didString, provider));
      assert.equal(keyHistory
        && Array.isArray(keyHistory)
        && keyHistory.map(data => data[0]).includes('5Ci9MiHGw123hKFDe4BsRjwMedsekB1zdLgB5jtCrqy7ZV7u'), true);
    })

    it('updateDidKey throws error on using existing public key', async () => {
      const pubKey = keyring?.createFromUri(NEW_MNEMONIC).publicKey;
      await assert.rejects(did.updateDidKey(testIdentifier, pubKey, null, sigKeypairValidator, provider), (err: any) => {
        assert.strictEqual(err.message, 'did.PublicKeyRegistered');
        return true;
      });
    });

    it('updateDidKey throws error on using non existent did', async () => {
      const pubKey = keyring?.createFromUri(TEST_MNEMONIC).publicKey;
      await assert.rejects(did.updateDidKey('did:ssid:nonexistentdid', pubKey, null, sigKeypairValidator, provider), (err: any) => {
        assert.strictEqual(err.message, 'did.DIDDoesNotExist');
        return true;
      });
    });

    it('Resolve test DID to account at block number 0 works correctly', async () => {
      const data:any = await did.resolveDIDToAccount(testIdentifier, provider, 0);
      assert.strictEqual(data, null);
      return true;
    });

    it('Resolve DID to account after did created works correctly', async () => {
      // const prevAccBlockNumAcc = await did.resolveDIDToAccount(testIdentifier, provider, addedDidBlockNum-1);
      const creatAccBlockNumAcc = await did.resolveDIDToAccount(testIdentifier, provider, addedDidBlockNum);
      const nextBlockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, addedDidBlockNum ? addedDidBlockNum + 1 : 0);
      // assert.strictEqual(prevAccBlockNumAcc, null);
      assert.strictEqual(creatAccBlockNumAcc, '5Ci9MiHGw123hKFDe4BsRjwMedsekB1zdLgB5jtCrqy7ZV7u');
      assert.strictEqual(nextBlockNumberAcc, '5Ci9MiHGw123hKFDe4BsRjwMedsekB1zdLgB5jtCrqy7ZV7u');
    });

    it('Resolve DID to account after key updated works correctly', async () => {
      const prevBlockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, updatedKeyBlockNum ? updatedKeyBlockNum + (-1) : 0);
      const keyUpdateBlockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, updatedKeyBlockNum);
      const nextblockNumberAcc = await did.resolveDIDToAccount(testIdentifier, provider, updatedKeyBlockNum ? updatedKeyBlockNum + 1 : 0);
      assert.strictEqual(prevBlockNumberAcc, '5Ci9MiHGw123hKFDe4BsRjwMedsekB1zdLgB5jtCrqy7ZV7u');
      assert.strictEqual(keyUpdateBlockNumberAcc, '5CA8uxffSzq2JyXVKXBudbgC3zBkQGzH2WUUf8ogBiJzxvFJ');
      assert.strictEqual(nextblockNumberAcc, '5CA8uxffSzq2JyXVKXBudbgC3zBkQGzH2WUUf8ogBiJzxvFJ');
    });


    after(async () => {
      // Delete created DID (did:ssid:rocket)
      if (constants.providerNetwork == 'local') {
        await did.removeDid('did:ssid:fenn', null, sigKeypair, provider);
      }
    })
  }
});