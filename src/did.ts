import { ApiPromise } from '@polkadot/api';
import { AnyJson } from '@polkadot/types/types';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
import { initKeyring } from './config';
import { buildConnection } from './connection';
import { KeyringPair } from '@polkadot/keyring/types';
import { did } from '.';
import { PRIVATE_DID_TYPE } from './common/types';
import { submitTransaction } from './common/helper';

const IDENTIFIER_PREFIX = 'did:ssid:';
const IDENTIFIER_MAX_LENGTH = 20;
const IDENTIFIER_MIN_LENGTH = 3;
const DID_HEX_LEN = 64;


/** Generate Mnemonic
 * @returns {String} Mnemonic
 */
const generateMnemonic = () => mnemonicGenerate();

const checkIdentifierFormat = (identifier) => {
  const format = /^[0-9a-zA-Z]+$/;

  return format.test(identifier);
};

/**
 * Generate did object to be stored in blockchain.
 * @returns {Object} Object containing did structure
 */
const generateDID = async (mnemonic: string, identifier: string, metadata = '') => {
  const keyring = await initKeyring();
  const isValidIdentifier = checkIdentifierFormat(identifier);
  const isValidMnemonic = mnemonicValidate(mnemonic);
  if (!isValidMnemonic) {
    throw new Error('Invalid Mnemonic');
  }
  if (!isValidIdentifier) {
    throw new Error('Invalid Identifier');
  }
  if (
    identifier.length > IDENTIFIER_MAX_LENGTH ||
    identifier.length < IDENTIFIER_MIN_LENGTH
  ) {
    throw new Error('Invalid Identifier length');
  }
  const pubKey = keyring.createFromUri(mnemonic).publicKey;
  return {
    "private": {
      public_key: pubKey,// this is the public key linked to the did
      identity: IDENTIFIER_PREFIX + identifier, // this is the actual did
      metadata,
    }
  };
};

/**
 * Create Private DID and store the generated DID object in blockchain
 * @param vc_id
 * @param identifier
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {String} txnId Txnid for storage operation.
 */

async function createPrivateDid(vc_id, identifier, signingKeypair: KeyringPair, api?: ApiPromise) {
  const provider = api || (await buildConnection('local')) as ApiPromise;
  // Check if identifier is available
  const did_hex = sanitiseDid(identifier);

  const didCheck = await did.resolveDIDToAccount(did_hex, provider);
  if(didCheck != null) {
    //return new Error('did.DIDAlreadyExists');
    throw(new Error('did.DIDAlreadyExists'));
  }

  // const pubkeyCheck = await did.resolveAccountIdToDid(DID.private.public_key, provider);
  // if(pubkeyCheck) {
  //   throw(new Error('did.PublicKeyRegistered'));
  // }

  const tx = provider.tx.did.createPrivate(vc_id, did_hex);
  // const tx = provider.tx.did.createPrivate(DID.private.public_key, sanitiseDid(DID.private.identity), DID.private.metadata);
  const nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Create Private DID and store the generated DID object in blockchain
 * @param vc_id
 * @param identifier
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {String} txnId Txnid for storage operation.
 */

 async function createPublicDid(vc_id, identifier, signingKeypair: KeyringPair, api?: ApiPromise) {
  const provider = api || (await buildConnection('local')) as ApiPromise;
  // Check if identifier is available
  const did_hex = sanitiseDid(identifier);

  const didCheck = await did.resolveDIDToAccount(did_hex, provider);
  if(didCheck != null) {
    //return new Error('did.DIDAlreadyExists');
    throw(new Error('did.DIDAlreadyExists'));
  }

  // const pubkeyCheck = await did.resolveAccountIdToDid(DID.private.public_key, provider);
  // if(pubkeyCheck) {
  //   throw(new Error('did.PublicKeyRegistered'));
  // }

  const tx = provider.tx.did.createPublic(vc_id, did_hex);
  // const tx = provider.tx.did.createPrivate(DID.private.public_key, sanitiseDid(DID.private.identity), DID.private.metadata);
  const nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  const signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}


/**
 * Get did information from accountID
 * @param {String} identifier DID Identifier
 * @returns {JSON}
 */
async function getDIDDetails(identifier: string, api?: ApiPromise): Promise<AnyJson> {
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
    if (data[0].private.identifier) {
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
        registration_number: data[0].public.registration_number,
        company_name: data[0].public.company_name,
        added_block: data[1],
      };
    }
  } catch (error) {
    throw Error('Failed to fetch details: ' + error);
  }
}

/**
 * Get the accountId for a given DID
 * @param {String} identifier
 * @param {ApiPromise} api
 * @param {Number} blockNumber (optional)
 * @returns {String}
 */



async function resolveDIDToAccount(identifier: string, api: ApiPromise, blockNumber?: number) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  if (!blockNumber && blockNumber !== 0) {
    return (await provider.query.did.lookup(did_hex)).toJSON();
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
 * @param {String} accountId (hex/base64 version works)
 * @param {ApiPromise} api
 */
async function resolveAccountIdToDid(accountId, api?: ApiPromise): Promise<string | boolean> {
  const provider = api || (await buildConnection('local'));
  const data = (await provider.query.did.rLookup(accountId)).toJSON();
  // return false if empty
  if (data === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return false;
  }

  return (typeof data === 'string') ? data : false;
}

/**
 * This function will rotate the keys assiged to a DID
 * It should only be called by validator accounts, else will fail
 * @param {String} identifier
 * @param {Uint8Array} newKey
 * @param {KeyringObj} signingKeypair // of a validator account
 * @param {ApiPromise} api
 */
async function updateDidKey(identifier, newKey, signingKeypair, api) {
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
  const tx = provider.tx.validatorCommittee.execute(provider.tx.did.rotateKey(did_hex, newKey), 1000);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  let signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

/**
 * Convert to hex but return fixed size always, mimics substrate storage
 * @param {String} data
 * @param {Int} size
 * @return {String}
 */
function convertFixedSizeHex(data, size = 64) {
  if (data.length > size) throw new Error('Invalid Data');
  const identifierHex = Buffer.from(data).toString('hex');
  return `0x${identifierHex.padEnd(size, '0')}`;
}

/**
 * Checks if the given did is in hex format or not & converts it into valid hex format.
 * 
 *  Note: This util function is needed since dependant module wont convert the utf did to hex anymore
 * 
 * @param {String} did
 * @return {String} Hex did
 */
const sanitiseDid = (did) => {

  if (did.startsWith('0x')) {
    // already hex string
    return did.padEnd(DID_HEX_LEN, '0');
  }
  // console.log('Converting to hex');
  let hex_did = Buffer.from(did, 'utf8').toString('hex');
  hex_did = '0x' + hex_did.padEnd(DID_HEX_LEN, '0');
  return hex_did;
}

/**
 * Check if the user is an approved validator
 * @param {String} identifier
 * @param {ApiPromise} api
 */
async function isDidValidator(identifier, api?: ApiPromise): Promise<boolean> {
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
 * @param {String} identifier
 * @param {ApiPromise} api
 * @returns {Array}
 */
async function getDidKeyHistory(identifier, api: ApiPromise | false = false) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  return (await provider.query.did.prevKeys(did_hex)).toJSON();
}

/**
 *
 * @param {String} identifier
 * @param {String} metadata
 * @param {KeyringObj} signingKeypair of a validator account
 * @param {ApiPromise} api
 */
async function updateMetadata(identifier, metadata, signingKeypair, api: any = false) {
  const provider = api || (await buildConnection('local'));
  const did_hex = sanitiseDid(identifier);
  const tx = provider.tx.validatorCommittee.execute(provider.tx.did.updateMetadata(did_hex, metadata), 1000);
  let nonce = await provider.rpc.system.accountNextIndex(signingKeypair.address);
  let signedTx = await tx.signAsync(signingKeypair, { nonce });
  return submitTransaction(signedTx, provider);
}

export {
  generateMnemonic,
  generateDID,
  createPrivateDid,
  createPublicDid,
  getDIDDetails,
  updateDidKey,
  resolveDIDToAccount,
  getDidKeyHistory,
  resolveAccountIdToDid,
  isDidValidator,
  updateMetadata,
  sanitiseDid,
};
