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
exports.totalIssuance = exports.tokenIssuer = exports.tokenInfoRLookup = exports.tokenInfo = exports.tokenData = exports.getTokenList = exports.tokenCurrencyCounter = exports.removedTokens = exports.getLocks = exports.sanitiseCCode = exports.transferToken = exports.transferWithMemo = exports.transferAll = exports.transfer = exports.slashToken = exports.subscribeToDetailedBalanceChanges = exports.subscribeToBalanceChanges = exports.getDetailedBalance = exports.setBalance = exports.getBalance = exports.removeToken = exports.mintToken = exports.issueToken = void 0;
const connection_1 = require("./connection");
const did_1 = require("./did");
const helper_1 = require("./common/helper");
const utils_1 = require("./utils");
const _1 = require(".");
const vc_1 = require("./vc");
// Extrinsic functions
/**
 * Issue a new currency
 * @param {HexString} vcId
 * @param {Number} totalSupply HIGHEST FORM WITHOUT DECIMALS
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api Ledger chain connection
 * @param {ApiPromise} relayApi Relay chain connection
 * @returns {Object} Transaction Object
 */
function issueToken(vcId, totalSupply, senderAccountKeyPair, api, relayApi) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        // get VC from VC ID
        let vc_details = yield _1.vc.getVCs(vcId, provider);
        if (!vc_details) {
            throw new Error('VC.VCNotRegistered');
        }
        // check if vc property has reservable balance
        let decoded_vc = (0, vc_1.decodeVCProperty)(vc_details.vcProperty, "TokenVC");
        if (decoded_vc.reservable_balance == undefined || decoded_vc.reservable_balance == null) {
            throw new Error('VC.VCNotReservable');
        }
        // Check for balance in relay
        const relayConn = relayApi || (yield (0, connection_1.buildConnection)('local'));
        let balance = yield _1.balances.getBalance(vc_details.owner, relayConn);
        if (decoded_vc.reservable_balance > (balance * Math.pow(10, 6))) {
            throw new Error('VC.InsufficientBalance');
        }
        const tx = provider.tx.tokens.issueToken(vcId, totalSupply * Math.pow(10, decoded_vc.decimal));
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.issueToken = issueToken;
/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function mintToken(vcId, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.tokens.mintToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.mintToken = mintToken;
/**
 * Remove Token from circulation
 * @param {String} currencyCode
 * @param {HexString} vcId
 * @param {String} fromDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function removeToken(currencyCode, vcId, fromDid, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let from_did_hex = (0, did_1.sanitiseDid)(fromDid);
        let from_did_check = yield _1.did.resolveDIDToAccount(from_did_hex, provider);
        if (!from_did_check) {
            throw new Error('DID.DIDNotRegistered');
        }
        const tx = provider.tx.sudo.sudo(provider.tx.tokens.removeToken(sanitiseCCode(currencyCode), vcId, from_did_hex));
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.removeToken = removeToken;
/**
 * Set Balance of a DID of a given currency
 * @param {String} dest
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function setBalance(dest, currencyCode, amount, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_1.sanitiseDid)(dest);
        let dest_check = yield _1.did.resolveDIDToAccount(dest_did_hex, provider);
        if (!dest_check) {
            throw new Error('DID.DIDNotRegistered');
        }
        const tx = provider.tx.tokens.setBalance(dest_did_hex, sanitiseCCode(currencyCode), amount);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.setBalance = setBalance;
/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function slashToken(vcId, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.tokens.slashToken(vcId);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.slashToken = slashToken;
/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function transfer(destDid, currencyCode, amount, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_1.sanitiseDid)(destDid);
        let dest_did_check = yield _1.did.resolveDIDToAccount(dest_did_hex, provider);
        if (!dest_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.tokens.transfer(dest_did_hex, sanitiseCCode(currencyCode), amount);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transfer = transfer;
/**
 * Transfer all token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function transferAll(destDid, currencyCode, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_1.sanitiseDid)(destDid);
        let dest_did_check = yield _1.did.resolveDIDToAccount(dest_did_hex, provider);
        if (!dest_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.tokens.transferAll(dest_did_hex, sanitiseCCode(currencyCode));
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferAll = transferAll;
/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {String} memo
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function transferWithMemo(destDid, currencyCode, amount, memo, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        let dest_did_hex = (0, did_1.sanitiseDid)(destDid);
        let dest_did_check = yield _1.did.resolveDIDToAccount(dest_did_hex, provider);
        if (!dest_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const tx = provider.tx.tokens.transferWithMemo(dest_did_hex, sanitiseCCode(currencyCode), amount, memo);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferWithMemo = transferWithMemo;
/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {string} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
function transferToken(vcId, toDid, senderAccountKeyPair, api) {
    return __awaiter(this, void 0, void 0, function* () {
        let to_did_hex = (0, did_1.sanitiseDid)(toDid);
        let to_did_check = yield _1.did.resolveDIDToAccount(to_did_hex, api);
        if (!to_did_check) {
            throw new Error('DID.RecipentDIDNotRegistered');
        }
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tx = provider.tx.tokens.transferToken(vcId, to_did_hex);
        let nonce = yield provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
        let signedTx = yield tx.signAsync(senderAccountKeyPair, { nonce });
        return (0, helper_1.submitTransaction)(signedTx, provider);
    });
}
exports.transferToken = transferToken;
/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
const sanitiseCCode = (token) => {
    if (!token)
        return null;
    if (token.startsWith('0x'))
        return token.padEnd(utils_1.CURRENCY_CODE_BYTES, '\0');
    return (0, utils_1.encodeData)(token.padEnd(utils_1.CURRENCY_CODE_BYTES, '\0'), 'currency_code');
};
exports.sanitiseCCode = sanitiseCCode;
// Storage Query Functions
/** Get account balance (Highest Form) based on the did supplied.
 * @param {string} did valid registered did
 * @param {string} currencyCode
 * @param {ApiPromise} api (optional)
 * @returns {number}
 */
const getBalance = (did, currencyCode, api) => __awaiter(void 0, void 0, void 0, function* () {
    // Resolve the did to get account ID
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const provider = api || (yield (0, connection_1.buildConnection)('local'));
            const tokenInfo = yield tokenData(currencyCode, provider);
            let decimals = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo['decimal'];
            // console.log('Decimals', decimals);
            const accountInfo = yield provider.query.tokens.accounts(sanitiseCCode(currencyCode), (0, did_1.sanitiseDid)(did));
            const data = (_a = accountInfo.toJSON()) === null || _a === void 0 ? void 0 : _a['data'];
            resolve(data.free / Math.pow(10, decimals));
        }
        catch (err) {
            // console.log(err);
            return reject(new Error("Cannot get balance"));
        }
    }));
});
exports.getBalance = getBalance;
/** Get account balance (Lowest Form) based on the did supplied.
 * A valid registered did is required
 * @param {string} currencyCode
 * @param {ApiPromise} api (optional)
 * @returns {Object} Balance Object { free: number, reserved: number, frozen: number}
 */
const getDetailedBalance = (did, currencyCode, api) => __awaiter(void 0, void 0, void 0, function* () {
    // Resolve the did to get account ID
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const provider = api || (yield (0, connection_1.buildConnection)('local'));
            const accountInfo = yield provider.query.tokens.accounts(sanitiseCCode(currencyCode), (0, did_1.sanitiseDid)(did));
            resolve((_b = accountInfo.toJSON()) === null || _b === void 0 ? void 0 : _b['data']);
        }
        catch (err) {
            // console.log(err);
            return reject(new Error("Cannot get balance"));
        }
    }));
});
exports.getDetailedBalance = getDetailedBalance;
/** Listen to balance (Highest Form) changes for a DID and execute the callback
 * @param {string} did
 * @param {string} currencyCode
 * @param {Function} callback
 * @param {ApiPromise} api
 */
const subscribeToBalanceChanges = (did, currencyCode, callback, api) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const tokenInfo = yield tokenData(currencyCode, provider);
        let decimals = tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo['decimal'];
        return yield provider.query.tokens.accounts(sanitiseCCode(currencyCode), (0, did_1.sanitiseDid)(did), ({ data: { free: currentBalance } }) => {
            callback(currentBalance.toNumber() / Math.pow(10, decimals));
        });
    }
    catch (err) {
        return null;
    }
});
exports.subscribeToBalanceChanges = subscribeToBalanceChanges;
/**
  * Subsribe to detailed balance changes for a DID and execute the callback.
  * @param {string} did
  * @param {string} currencyCode
  * @param {Function} callback
  * @param {ApiPromise} api
  */
const subscribeToDetailedBalanceChanges = (did, currencyCode, callback, api) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return yield provider.query.tokens.accounts(sanitiseCCode(currencyCode), (0, did_1.sanitiseDid)(did), ({ data }) => {
            callback(data.toJSON());
        });
    }
    catch (err) {
        return null;
    }
});
exports.subscribeToDetailedBalanceChanges = subscribeToDetailedBalanceChanges;
/**
 * get Token List
 * @param {ApiPromise} api
 * @returns {Object} Token List
 */
function getTokenList(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        const data = yield provider.query.tokens.tokenData.entries();
        if (!data)
            return null;
        return data.map(([{ args: [currencyCode] }, value]) => ({
            name: value.toHuman().tokenName,
            currencyCode: value.toHuman().currencyCode,
            decimal: value.toHuman().decimal,
            blockNumber: value.toHuman().blockNumber,
        }));
    });
}
exports.getTokenList = getTokenList;
/**
 * Get any liquidity locks of a token type under an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
function getLocks(currencyCode, did, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.locks(sanitiseCCode(currencyCode), (0, did_1.sanitiseDid)(did))).toJSON();
    });
}
exports.getLocks = getLocks;
/**
 * Storage map between currency code and block number
 * @param {ApiPromise} api
 * @param {String} currencyCode (Optional)
 */
function removedTokens(api, currencyCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.removedTokens(sanitiseCCode(currencyCode))).toJSON();
    });
}
exports.removedTokens = removedTokens;
/**
 * Token currency counter
 * @param {ApiPromise} api
 */
function tokenCurrencyCounter(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenCurrencyCounter()).toString();
    });
}
exports.tokenCurrencyCounter = tokenCurrencyCounter;
/**
 * Map to store a friendly token name for token
 * @param {string | null} currencyCode
 * @param {ApiPromise} api
 */
function tokenData(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenData(sanitiseCCode(currencyCode))).toJSON();
    });
}
exports.tokenData = tokenData;
/**
 * Get Token Information
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Currency Id
 */
function tokenInfo(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenInfo(sanitiseCCode(currencyCode))).toString();
    });
}
exports.tokenInfo = tokenInfo;
/**
 * Reverse lookup Token Information
 * @param {Number} currencyId
 * @param {ApiPromise} api
 * @returns {HexString} Currency Code Hex
 */
function tokenInfoRLookup(currencyId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenInfoRLookup(currencyId)).toHex();
    });
}
exports.tokenInfoRLookup = tokenInfoRLookup;
/**
 * Lookup Token Issuer
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {HexString} Token Owner DID Hex
 */
function tokenIssuer(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.tokenIssuer(sanitiseCCode(currencyCode))).toHex();
    });
}
exports.tokenIssuer = tokenIssuer;
/**
 * Get Total Token Issuance
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Token Issuance
 */
function totalIssuance(currencyCode, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = api || (yield (0, connection_1.buildConnection)('local'));
        return (yield provider.query.tokens.totalIssuance(sanitiseCCode(currencyCode))).toString();
    });
}
exports.totalIssuance = totalIssuance;

//# sourceMappingURL=ledgers.js.map
