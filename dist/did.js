"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDid = exports.syncDid = exports.sanitiseDid = exports.updateMetadata = exports.isDidValidator = exports.resolveAccountIdToDid = exports.getDidKeyHistory = exports.resolveDIDToAccount = exports.updateDidKey = exports.getDIDDetails = exports.createPublic = exports.createPrivate = exports.generateMnemonic = void 0;
const util_crypto_1 = require("@polkadot/util-crypto");
const connection_1 = require("./connection");
const _1 = require(".");
const helper_1 = require("./common/helper");
const IDENTIFIER_PREFIX = 'did:ssid:';
const IDENTIFIER_MAX_LENGTH = 20;
const IDENTIFIER_MIN_LENGTH = 3;
const DID_HEX_LEN = 64;
/** Generate Mnemonic
 * @returns {String} Mnemonic
 */
const generateMnemonic = () => (0, util_crypto_1.mnemonicGenerate)();
exports.generateMnemonic = generateMnemonic;
const checkIdentifierFormat = (identifier) => {
    const format = /^[0-9a-zA-Z]+$/;
    return format.test(identifier);
};
/**
 * Store the generated DID VC
 * @param vcId
 * @param paraId Optional - Stores in current chain if paraId not provided
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {String} txnId Txnid for storage operation.
 */
function createPrivate(vcId, paraId = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        // // Check if identifier is available
        // const did_hex = sanitiseDid(identifier);
        // const didCheck = await did.resolveDIDToAccount(did_hex, provider);
        // if(didCheck != null) {
        //   //return new Error('did.DIDAlreadyExists');
        //   throw(new Error('did.DIDAlreadyExists'));
        // }
        // const pubkeyCheck = await did.resolveAccountIdToDid(DID.private.public_key, provider);
        // if(pubkeyCheck) {
        //   throw(new Error('did.PublicKeyRegistered'));
        // }
        const tx = provider.tx.did.createPrivate(vcId, paraId);
        const nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.createPrivate = createPrivate;
/**
 * Create Private DID and store the generated DID object in blockchain
 * @param vcId
 * @param paraId Optional - Stores in current chain if paraId not provided
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {String} txnId Txnid for storage operation.
 */
function createPublic(vcId, paraId = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        // // Check if identifier is available
        // const did_hex = sanitiseDid(identifier);
        // const didCheck = await did.resolveDIDToAccount(did_hex, provider);
        // if(didCheck != null) {
        //   //return new Error('did.DIDAlreadyExists');
        //   throw(new Error('did.DIDAlreadyExists'));
        // }
        // const pubkeyCheck = await did.resolveAccountIdToDid(DID.private.public_key, provider);
        // if(pubkeyCheck) {
        //   throw(new Error('did.PublicKeyRegistered'));
        // }
        const tx = provider.tx.did.createPublic(vcId, paraId);
        const nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.createPublic = createPublic;
/**
 * Get did information from accountID
 * @param {String} identifier DID Identifier
 * @returns {JSON}
 */
function getDIDDetails(identifier, api) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const provider = api;
            if (!provider) {
                throw new Error('Not connected to blockchain');
            }
            const did_hex = sanitiseDid(identifier);
            const data = (yield provider.query.did.diDs(did_hex)).toJSON();
            // console.log('data', data);
            if (data == null) {
                console.log('DID not found');
                return null;
            }
            if ((_b = (_a = data === null || data === void 0 ? void 0 : data[0]) === null || _a === void 0 ? void 0 : _a.private) === null || _b === void 0 ? void 0 : _b.identifier) {
                return {
                    identifier: data[0].private.identifier,
                    public_key: data[0].private.publicKey,
                    metadata: data[0].private.metadata,
                    added_block: data[1],
                };
            }
            else {
                return {
                    identifier: data[0].public.identifier,
                    public_key: data[0].public.publicKey,
                    metadata: data[0].public.metadata,
                    registration_number: data[0].public.registrationNumber,
                    company_name: data[0].public.companyName,
                    added_block: data[1],
                };
            }
        }
        catch (error) {
            throw Error('Failed to fetch details: ' + error);
        }
    });
}
exports.getDIDDetails = getDIDDetails;
/**
 * Get the accountId for a given DID
 * @param {String} identifier
 * @param {ApiPromise} api
 * @param {Number} blockNumber (optional)
 * @returns {String}
 */
function resolveDIDToAccount(identifier, api, blockNumber) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        if (!blockNumber && blockNumber !== 0) {
            return (yield provider.query.did.lookup(did_hex)).toJSON();
        }
        const didDetails = yield getDIDDetails(identifier, provider);
        if (didDetails == null)
            return null;
        if (typeof (didDetails === null || didDetails === void 0 ? void 0 : didDetails['added_block']) === 'number') {
            if (blockNumber >= (didDetails === null || didDetails === void 0 ? void 0 : didDetails['added_block'])) {
                return (yield provider.query.did.lookup(did_hex)).toJSON();
            }
        }
        const keyHistories = yield getDidKeyHistory(identifier, provider);
        if (!keyHistories) {
            return null;
        }
        if (!Array.isArray(keyHistories))
            return null;
        const keyIndex = keyHistories.reverse().findIndex((value) => blockNumber >= parseInt(value === null || value === void 0 ? void 0 : value[1]));
        if (keyIndex < 0) {
            return null;
        }
        return (_a = keyHistories[keyIndex]) === null || _a === void 0 ? void 0 : _a[0];
    });
}
exports.resolveDIDToAccount = resolveDIDToAccount;
/**
 * Get the DID associated to given accountID
 * @param {String} accountId (hex/base64 version works)
 * @param {ApiPromise} api
 */
function resolveAccountIdToDid(accountId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const data = (yield provider.query.did.rLookup(accountId)).toJSON();
        // return false if empty
        if (data === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            return false;
        }
        return (typeof data === 'string') ? data : false;
    });
}
exports.resolveAccountIdToDid = resolveAccountIdToDid;
/**
 * This function will rotate the keys assiged to a DID
 * It should only be called by validator accounts, else will fail
 * @param {String} identifier
 * @param {Uint8Array} newKey
 * @param {KeyringPair} paraId
 * @param {KeyringObj} signingKeypair // of a validator account
 * @param {ApiPromise} api
 */
function updateDidKey(identifier, newKey, paraId = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const data = yield _1.did.resolveDIDToAccount(did_hex, provider);
        if (data == null) {
            throw (new Error('did.DIDDoesNotExist'));
        }
        const data2 = yield _1.did.resolveAccountIdToDid(newKey, provider);
        if (data2 != false) {
            throw (new Error('did.PublicKeyRegistered'));
        }
        // call the rotateKey extrinsinc
        const tx = provider.tx.validatorCommittee.execute(provider.tx.did.rotateKey(did_hex, newKey, paraId), 1000);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.updateDidKey = updateDidKey;
/**
 * Convert to hex but return fixed size always, mimics substrate storage
 * @param {String} data
 * @param {Int} size
 * @return {String}
 */
function convertFixedSizeHex(data, size = 64) {
    if (data.length > size)
        throw new Error('Invalid Data');
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
};
exports.sanitiseDid = sanitiseDid;
/**
 * Check if the user is an approved validator
 * @param {String} identifier
 * @param {ApiPromise} api
 */
function isDidValidator(identifier, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const vList = (yield provider.query.validatorSet.members()).toJSON();
        if (vList && Array.isArray(vList)) {
            return vList.includes(did_hex);
        }
        return false;
    });
}
exports.isDidValidator = isDidValidator;
/**
 * Fetch the history of rotated keys for the specified DID
 * @param {String} identifier
 * @param {ApiPromise} api
 * @returns {Array}
 */
function getDidKeyHistory(identifier, api = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        return (yield provider.query.did.prevKeys(did_hex)).toJSON();
    });
}
exports.getDidKeyHistory = getDidKeyHistory;
/**
 *
 * @param {String} identifier
 * @param {String} metadata
 * @param {KeyringObj} signingKeypair of a validator account
 * @param {ApiPromise} api
 */
function updateMetadata(identifier, metadata, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const tx = provider.tx.validatorCommittee.execute(provider.tx.did.updateMetadata(did_hex, metadata), 1000);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.updateMetadata = updateMetadata;
/**
 * Sync DID VC with other chains
 * @param {String} identifier
 * @param {String} paraId Optional
 * @param {KeyringObj} signingKeypair of a validator account
 * @param {ApiPromise} api
 */
function syncDid(identifier, paraId = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const tx = provider.tx.validatorCommittee.execute(provider.tx.did.syncDid(did_hex, paraId), 1000);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.syncDid = syncDid;
/**
 * Remove DID VC
 * @param {String} identifier
 * @param {String} paraId Optional
 * @param {KeyringObj} signingKeypair of a SUDO account
 * @param {ApiPromise} api
 */
function removeDid(identifier, paraId = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const tx = provider.tx.sudo.sudo(provider.tx.did.remove(did_hex, paraId));
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeDid = removeDid;