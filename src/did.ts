import { ApiPromise } from '@polkadot/api';
import { AnyJson } from '@polkadot/types/types';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { buildConnection } from './connection';
import { KeyringPair } from '@polkadot/keyring/types';
import { did, tokenchain, utils } from '.';
import { submitTransaction } from './common/helper';
import { QueryableModuleStorage } from '@polkadot/api/types';

/** Generate Mnemonic
 * @returns {string} Mnemonic
 */
const generateMnemonic = () => mnemonicGenerate();

const checkIdentifierFormat = (identifier) => {
  const format = /^[0-9a-zA-Z]+$/;

  return format.test(identifier);
};

/**
 * Store the generated DID VC
 * @param {HexString} vcId
 * @param {number|string|null} syncTo - is null for relay chain. Pass valid paraId 
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */

async function createPrivate(vcId, syncTo = null, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || (await buildConnection('local')) as ApiPromise;
  const tx = provider.tx.did.createPrivate(vcId, await sanitiseSyncTo(syncTo, provider));
  const nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Create Private DID and store the generated DID object in blockchain
 * @param {HexString} vcId
 * @param {number|string} syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */

async function createPublic(vcId, syncTo = null, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || (await buildConnection('local')) as ApiPromise;
  const tx = provider.tx.did.createPublic(vcId, await sanitiseSyncTo(syncTo, provider));
  const nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}


/**
 * Get did information from accountID
 * @param {string} identifier DID Identifier
 * @param {ApiPromise} api
 * @returns {JSON} DID Information
 */
async function getDIDDetails(identifier: string, api: ApiPromise): Promise<AnyJson> {
  try {
    const provider = api;
    if (!provider) {
      throw new Error('Not connected to blockchain');
    }
    const did_hex = sanitiseDid(identifier);
    const data = (await provider.query.did.diDs(did_hex)).toJSON();
    if (data == null) {
      console.log('DID not found');
      return null;
    }
    
    if (data?.[0]?.private?.identifier) {
      return {
        identifier: data[0].private.identifier,
        public_key: data[0].private.publicKey,
        metadata: data[0].private.metadata,
        added_block: data[1],
      };
    } else {
      return {
        identifier: data[0].public.identifier,
        public_key: data[0].public.publicKey,
        metadata: data[0].public.metadata,
        registration_number: data[0].public.registrationNumber,
        company_name: data[0].public.companyName,
        added_block: data[1],
      };
    }
  } catch (error) {
    throw Error('Failed to fetch details: ' + error);
  }
}

/**
 * Get the accountId for a given DID
 * @param {string} identifier
 * @param {ApiPromise} api
 * @param {Number} blockNumber (optional)
 * @returns {JSON}
 */

async function resolveDIDToAccount(identifier: string, api: ApiPromise, blockNumber?: number) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  if (!blockNumber && blockNumber !== 0) {
    let lookUpModule: QueryableModuleStorage<"promise">;
    if(provider.query.did) {
      lookUpModule=provider.query.did;
    } else if(provider.query.cacheDid) {
      lookUpModule=provider.query.cacheId;
    } else {
      throw new Error("No DID module found");
    }
    return (await lookUpModule.lookup(did_hex)).toJSON();
  }
  const didDetails: AnyJson = await getDIDDetails(identifier, provider);
  if (didDetails == null) return null;
  if (typeof didDetails?.['added_block'] === 'number') {
    if (blockNumber >= didDetails?.['added_block']) {
      return (await provider.query.did.lookup(did_hex)).toJSON();
    }
  }
  const keyHistories = await getDidKeyHistory(identifier, provider);
  if (!keyHistories) {
    return null;
  }
  if (!Array.isArray(keyHistories)) return null

  const keyIndex = keyHistories.reverse().findIndex((value: AnyJson) => blockNumber >= parseInt(value?.[1]));
  if (keyIndex < 0) {
    return null;
  }
  return keyHistories[keyIndex]?.[0];
}

/**
 * Get the DID associated to given accountID
 * @param {string} accountId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {JSON}
 */
async function resolveAccountIdToDid(accountId, api: ApiPromise): Promise<string | Boolean> {
  const provider = api || (await buildConnection('local'));
  let lookUpModule: QueryableModuleStorage<"promise">;
  if(provider.query.did) {
    lookUpModule=provider.query.did;
  } else if(provider.query.cacheDid) {
    lookUpModule=provider.query.cacheId;
  } else {
    throw new Error("No DID module found");
  }

  const data = (await lookUpModule.rLookup(accountId)).toJSON();
  if (data === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return false;
  }
  return (typeof data === 'string') ? data : false;
}

/**
 * This function will rotate the keys assiged to a DID
 * It should only be called by validator accounts, else will fail
 * @param {string} identifier
 * @param {Uint8Array} newKey
 * @param {string|number} syncTo
 * @param {KeyringPair} signingKeypair // of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function updateDidKey(identifier, newKey, syncTo = null, signingKeypair: KeyringPair, api: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  const data = await did.resolveDIDToAccount(did_hex, provider);
  if(data == null) {
    throw(new Error('did.DIDDoesNotExist'));
  }

  const data2 = await did.resolveAccountIdToDid(newKey, provider);
  if(data2 != false) {
    throw(new Error('did.PublicKeyRegistered'));
  }
  // call the rotateKey extrinsinc
  const tx = provider.tx.validatorCommittee.execute(provider.tx.did.rotateKey(did_hex, newKey, await sanitiseSyncTo(syncTo, provider)), 1000);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  let signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Convert to hex but return fixed size always, mimics substrate storage
 * @param {string} data
 * @param {number} size
 * @return {string}
 */
function convertFixedSizeHex(data: string, size = 64) {
  if (data.length > size) throw new Error('Invalid Data');
  return utils.encodeData(data.padEnd(utils.DID_BYTES, '\0'), 'Did');
}

/**
 * Checks if the given did is in hex format or not & converts it into valid hex format.
 * 
 *  Note: This util function is needed since dependant module wont convert the utf did to hex anymore
 * 
 * @param {string} did
 * @return {string} Hex did
 */
const sanitiseDid = (did) => {
  if (did.startsWith('0x'))
    return did.padEnd(utils.DID_BYTES, '\0');
  return utils.encodeData(did.padEnd(utils.DID_BYTES, '\0'), 'Did');
}

/**
 * Sanitize paraId before creating a did
 * @param {string|number|null} syncTo
 * @param {ApiPromise} api
 * @returns {number|null}
 */
const sanitiseSyncTo = async (syncTo, api: ApiPromise) => {
  const provider = api || await buildConnection('local');
  if(!syncTo || syncTo === null) {
    return null;
  } else {
    if(parseInt(syncTo) > 0) {
      let data = await tokenchain.lookUpParaId(syncTo, provider);
      if(data)
        return parseInt(syncTo);

      throw new Error('Invalid paraId : syncTo');
    
    } else if(typeof syncTo === 'string') {
      let paraId = await tokenchain.lookup(syncTo, provider) || null;
      if(paraId)
        return paraId;
      throw new Error('Invalid Currency Code : syncTo');
    }
  }
  throw new Error('Invalid syncTo');
}

/**
 * Check if the user is an approved validator
 * @param {string} identifier
 * @param {ApiPromise} api
 * @returns {Boolean}
 */
async function isDidValidator(identifier: string, api: ApiPromise): Promise<boolean> {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  const vList = (await provider.query.validatorSet.members()).toJSON();
  if (vList && Array.isArray(vList)) {
    return vList.includes(did_hex);
  }
  return false
}

/**
 * Fetch the history of rotated keys for the specified DID
 * @param {string} identifier
 * @param {ApiPromise} api
 * @returns {JSON}
 */
async function getDidKeyHistory(identifier: string, api: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  return (await provider.query.did.prevKeys(did_hex)).toJSON();
}

/**
 *
 * @param {string} identifier
 * @param {string} metadata
 * @param {Keyringpair} signingKeypair of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function updateMetadata(identifier, metadata, signingKeypair, api: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  const tx = provider.tx.validatorCommittee.execute(provider.tx.did.updateMetadata(did_hex, metadata), 1000);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  let signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Sync DID VC with other chains
 * @param {string} identifier
 * @param syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function syncDid(identifier, syncTo = null, signingKeypair, api: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  const tx = provider.tx.validatorCommittee.execute(provider.tx.did.syncDid(did_hex, await sanitiseSyncTo(syncTo, provider)), 1000);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  let signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Remove DID VC
 * @param {string} identifier
 * @param syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair of a SUDO account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function removeDid(identifier, syncTo = null, signingKeypair, api: ApiPromise) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  const tx = provider.tx.sudo.sudo(provider.tx.did.remove(did_hex, await sanitiseSyncTo(syncTo, provider)));
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  let signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

export {
  convertFixedSizeHex,
  generateMnemonic,
  createPrivate,
  createPublic,
  getDIDDetails,
  updateDidKey,
  resolveDIDToAccount,
  getDidKeyHistory,
  resolveAccountIdToDid,
  isDidValidator,
  updateMetadata,
  sanitiseDid,
  sanitiseSyncTo,
  syncDid,
  removeDid
};
