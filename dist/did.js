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
exports.removeDid = exports.syncDid = exports.sanitiseSyncTo = exports.sanitiseDid = exports.updateMetadata = exports.isDidValidator = exports.resolveAccountIdToDid = exports.getDidKeyHistory = exports.resolveDIDToAccount = exports.updateDidKey = exports.getDIDDetails = exports.createPublic = exports.createPrivate = exports.generateMnemonic = exports.convertFixedSizeHex = void 0;
const util_crypto_1 = require("@polkadot/util-crypto");
const connection_1 = require("./connection");
const _1 = require(".");
const helper_1 = require("./common/helper");
global.Buffer = require('buffer').Buffer;
const DID_HEX_LEN = 64;
/** Generate Mnemonic
 * @returns {string} Mnemonic
 */
const generateMnemonic = () => (0, util_crypto_1.mnemonicGenerate)();
exports.generateMnemonic = generateMnemonic;
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
function createPrivate(vcId, syncTo = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.did.createPrivate(vcId, sanitiseSyncTo(syncTo, provider));
        const nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.createPrivate = createPrivate;
/**
 * Create Private DID and store the generated DID object in blockchain
 * @param {HexString} vcId
 * @param {number|string} syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function createPublic(vcId, syncTo = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.did.createPublic(vcId, sanitiseSyncTo(syncTo, provider));
        const nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        const signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.createPublic = createPublic;
/**
 * Get did information from accountID
 * @param {string} identifier DID Identifier
 * @param {ApiPromise} api
 * @returns {JSON} DID Information
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
 * @param {string} identifier
 * @param {ApiPromise} api
 * @param {Number} blockNumber (optional)
 * @returns {JSON}
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
 * @param {string} accountId (hex/base64 version works)
 * @param {ApiPromise} api
 * @returns {JSON}
 */
function resolveAccountIdToDid(accountId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const data = (yield provider.query.did.rLookup(accountId)).toJSON();
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
 * @param {string} identifier
 * @param {Uint8Array} newKey
 * @param {string|number} syncTo
 * @param {KeyringPair} signingKeypair // of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function updateDidKey(identifier, newKey, syncTo = null, signingKeypair, api) {
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
        const tx = provider.tx.validatorCommittee.execute(provider.tx.did.rotateKey(did_hex, newKey, sanitiseSyncTo(syncTo, provider)), 1000);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.updateDidKey = updateDidKey;
/**
 * Convert to hex but return fixed size always, mimics substrate storage
 * @param {string} data
 * @param {number} size
 * @return {string}
 */
function convertFixedSizeHex(data, size = 64) {
    if (data.length > size)
        throw new Error('Invalid Data');
    const identifierHex = Buffer.from(data).toString('hex');
    return `0x${identifierHex.padEnd(size, '0')}`;
}
exports.convertFixedSizeHex = convertFixedSizeHex;
/**
 * Checks if the given did is in hex format or not & converts it into valid hex format.
 *
 *  Note: This util function is needed since dependant module wont convert the utf did to hex anymore
 *
 * @param {string} did
 * @return {string} Hex did
 */
const sanitiseDid = (did) => {
    if (did.startsWith('0x')) {
        return did.padEnd(DID_HEX_LEN, '0');
    }
    let hex_did = Buffer.from(did, 'utf8').toString('hex');
    hex_did = '0x' + hex_did.padEnd(DID_HEX_LEN, '0');
    return hex_did;
};
exports.sanitiseDid = sanitiseDid;
/**
 * Sanitize paraId before creating a did
 * @param {string|number|null} syncTo
 * @param {ApiPromise} api
 * @returns {number|null}
 */
const sanitiseSyncTo = (syncTo, api) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = api || (yield (0, connection_1.buildConnection)('local'));
    if (!syncTo || syncTo === null) {
        return null;
    }
    else {
        if (parseInt(syncTo) > 0) {
            let data = yield _1.tokenchain.reverseLookupTokenchain(syncTo, provider);
            if (data)
                return parseInt(syncTo);
            throw new Error('Invalid paraId : syncTo');
        }
        else if (typeof syncTo === 'string') {
            let paraId = (yield _1.tokenchain.lookupTokenchain(syncTo, provider)) || null;
            if (paraId)
                return paraId;
            throw new Error('Invalid Currency Code : syncTo');
        }
    }
    throw new Error('Invalid syncTo');
});
exports.sanitiseSyncTo = sanitiseSyncTo;
/**
 * Check if the user is an approved validator
 * @param {string} identifier
 * @param {ApiPromise} api
 * @returns {Boolean}
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
 * @param {string} identifier
 * @param {ApiPromise} api
 * @returns {JSON}
 */
function getDidKeyHistory(identifier, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        return (yield provider.query.did.prevKeys(did_hex)).toJSON();
    });
}
exports.getDidKeyHistory = getDidKeyHistory;
/**
 *
 * @param {string} identifier
 * @param {string} metadata
 * @param {Keyringpair} signingKeypair of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
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
 * @param {string} identifier
 * @param syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair of a validator account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function syncDid(identifier, syncTo = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const tx = provider.tx.validatorCommittee.execute(provider.tx.did.syncDid(did_hex, sanitiseSyncTo(syncTo, provider)), 1000);
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.syncDid = syncDid;
/**
 * Remove DID VC
 * @param {string} identifier
 * @param syncTo - is null for relay chain
 * @param {KeyringPair} signingKeypair of a SUDO account
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function removeDid(identifier, syncTo = null, signingKeypair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const did_hex = sanitiseDid(identifier);
        const tx = provider.tx.sudo.sudo(provider.tx.did.remove(did_hex, sanitiseSyncTo(syncTo, provider)));
        let nonce = yield provider.rpc.system.accountNextIndex(signingKeypair.address);
        let signedTx = yield tx.signAsync(signingKeypair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeDid = removeDid;

//# sourceMappingURL=did.js.map
