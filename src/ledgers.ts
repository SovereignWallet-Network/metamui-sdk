import { buildConnection } from './connection';
import { sanitiseDid } from './did';
import { ApiPromise } from '@polkadot/api';
import { submitTransaction } from './common/helper';
import { KeyringPair } from '@polkadot/keyring/types';
import { encodeData, CURRENCY_CODE_BYTES } from './utils';
import { balances, did, vc } from '.';
import { decodeVCProperty } from './vc';

// Extrinsic functions

/**
 * Issue a new currency
 * @param {HexString} vcId
 * @param {Number} totalSupply HIGHEST FORM WITHOUT DECIMALS
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function issueToken(
    vcId,
    totalSupply,
    senderAccountKeyPair: KeyringPair,
    api: ApiPromise,
 ) {
   const provider = api || (await buildConnection('local'));
   // get VC from VC ID
   let vc_details: any = await vc.getVCs(vcId, provider);
   if (!vc_details) {
      throw new Error('VC.VCNotRegistered');
   }
   // check if vc property has reservable balance
   let decoded_vc = decodeVCProperty(vc_details.vcProperty, "TokenVC");
   if (!decoded_vc.reservable_balance) {
      throw new Error('VC.VCNotReservable');
   }
   // Check for balance in relay
   const relayConn = await buildConnection(process.env.PROVIDER_NETWORK || 'local');
   let balance = await balances.getBalance(vc_details.owner, relayConn);
   if (decoded_vc.reservable_balance > ( balance * Math.pow(10, 6)) ) {
      throw new Error('VC.InsufficientBalance');
   }

   const tx = provider.tx.tokens.issueToken(vcId, totalSupply * Math.pow(10, decoded_vc.decimal));
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Mint token to given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function mintToken(
   vcId,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
 ) {
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.mintToken(vcId);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Remove Token from circulation
 * @param {String} currencyCode
 * @param {HexString} vcId
 * @param {String} fromDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function removeToken(
  currencyCode,
  vcId,
  fromDid,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
   const provider = api || (await buildConnection('local'));
   let from_did_hex = sanitiseDid(fromDid);
   let from_did_check = await did.resolveDIDToAccount(from_did_hex, provider);
   if (!from_did_check) {
        throw new Error('DID.DIDNotRegistered');
   }
   const tx = provider.tx.sudo.sudo(
      provider.tx.tokens.removeToken(sanitiseCCode(currencyCode), vcId, from_did_hex)
   );
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Set Balance of a DID of a given currency
 * @param {String} dest
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
  async function setBalance(
   dest,
   currencyCode,
   amount,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(dest);
   let dest_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_check) {
      throw new Error('DID.DIDNotRegistered');
   }
   const tx = provider.tx.tokens.setBalance(dest_did_hex, sanitiseCCode(currencyCode), amount);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Slash token from given currency
 * @param {HexString} vcId
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
async function slashToken(
  vcId,
  senderAccountKeyPair: KeyringPair,
  api: ApiPromise,
) {
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.slashToken(vcId);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {Number} amount
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transfer(
   destDid,
   currencyCode,
   amount,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(destDid);
   let dest_did_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_did_check) {
      throw new Error('DID.RecipentDIDNotRegistered');
   }
   const tx = provider.tx.tokens.transfer(dest_did_hex, sanitiseCCode(currencyCode), amount);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer all token balance to another account
 * @param {String} destDid
 * @param {String} currencyCode
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transferAll(
   destDid,
   currencyCode,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(destDid);
   let dest_did_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_did_check) {
      throw new Error('DID.RecipentDIDNotRegistered');
   }
   const tx = provider.tx.tokens.transferAll(dest_did_hex, sanitiseCCode(currencyCode));
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

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
 async function transferTokenWithMemo(
   destDid,
   currencyCode,
   amount,
   memo,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   let dest_did_hex = sanitiseDid(destDid);
   let dest_did_check = await did.resolveDIDToAccount(dest_did_hex, provider);
   if (!dest_did_check) {
      throw new Error('DID.RecipentDIDNotRegistered');
   }
   const tx = provider.tx.tokens.transferTokenWithMemo(dest_did_hex, sanitiseCCode(currencyCode), amount, memo);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Transfer tokens to a DID
 * @param {HexString} vcId
 * @param {string} toDid
 * @param {KeyringPair} senderAccountKeyPair
 * @param {ApiPromise} api
 * @returns {Object} Transaction Object
 */
 async function transferToken(
   vcId,
   toDid,
   senderAccountKeyPair: KeyringPair,
   api: ApiPromise,
   ) {

   let to_did_hex = sanitiseDid(toDid);
   let to_did_check = await did.resolveDIDToAccount(to_did_hex, api);
   if (!to_did_check) {
       throw new Error('DID.RecipentDIDNotRegistered');
   }
   const provider = api || (await buildConnection('local'));
   const tx = provider.tx.tokens.transferToken(vcId, to_did_hex);
   let nonce = await provider.rpc.system.accountNextIndex(senderAccountKeyPair.address);
   let signedTx = await tx.signAsync(senderAccountKeyPair, { nonce });
   return submitTransaction(signedTx, provider);
}

/**
 * Sanitise Token Name
 * @param {String} token
 * @returns {String} Sanitised Token Name
 */
 const sanitiseCCode = (token) => {
   if(!token) return null;
   if (token.startsWith('0x'))
      return token.padEnd(CURRENCY_CODE_BYTES, '\0');
   return encodeData(token.padEnd(CURRENCY_CODE_BYTES, '\0'), 'currency_code');
}

// Storage Query Functions

/** Get account balance (Highest Form) based on the did supplied.
 * @param {string} did valid registered did
 * @param {string} currencyCode
 * @param {ApiPromise} api (optional)
 * @returns {number}
 */
 const getBalance = async (did: string, currencyCode: string, api: ApiPromise): Promise<number> => {
   // Resolve the did to get account ID
   return new Promise(async (resolve, reject) => {
      try {
         const provider = api || await buildConnection('local');
         const tokenInfo = await tokenData(currencyCode, provider);
         let decimals = tokenInfo?.['decimal'];
         // console.log('Decimals', decimals);
         const accountInfo = await provider.query.tokens.accounts(sanitiseCCode(currencyCode), sanitiseDid(did));
         const data = accountInfo.toJSON()?.['data'];
         resolve(data.free / Math.pow(10, decimals));
      } catch (err) {
         // console.log(err);
         return reject(new Error("Cannot get balance"));
      }
   });
}

/** Get account balance (Lowest Form) based on the did supplied.
 * A valid registered did is required
 * @param {string} currencyCode
 * @param {ApiPromise} api (optional)
 * @returns {Object} Balance Object { free: number, reserved: number, frozen: number}
 */
 const getDetailedBalance = async (did: string, currencyCode: string, api: ApiPromise) => {
   // Resolve the did to get account ID
   return new Promise(async (resolve, reject) => {
      try {
         const provider = api || await buildConnection('local');
         const accountInfo = await provider.query.tokens.accounts(sanitiseCCode(currencyCode), sanitiseDid(did));
         resolve( accountInfo.toJSON()?.['data'] );
      } catch (err) {
         // console.log(err);
         return reject(new Error("Cannot get balance"));
      }
   });
}

/** Listen to balance (Highest Form) changes for a DID and execute the callback
 * @param {string} did
 * @param {string} currencyCode
 * @param {Function} callback
 * @param {ApiPromise} api
 */
 const subscribeToBalanceChanges = async (did: string, currencyCode: string, callback: (balance: number) => void, api: ApiPromise) => {
   try {
     const provider = api || await buildConnection('local');
     const tokenInfo = await tokenData(currencyCode, provider);
     let decimals = tokenInfo?.['decimal'];
     return await provider.query.tokens.accounts(sanitiseCCode(currencyCode), sanitiseDid(did), ({ data: { free: currentBalance } }) => {
       callback(currentBalance.toNumber() / Math.pow(10, decimals));
     });
   } catch (err) {
     return null;
   }
};

 
/**
  * Subsribe to detailed balance changes for a DID and execute the callback.
  * @param {string} did
  * @param {string} currencyCode
  * @param {Function} callback
  * @param {ApiPromise} api
  */
 const subscribeToDetailedBalanceChanges = async (did: string, currencyCode: string, callback: (data: Object) => void, api: ApiPromise) => {
   try {
     const provider = api || await buildConnection('local');
     return await provider.query.tokens.accounts(sanitiseCCode(currencyCode), sanitiseDid(did), ({ data }) => {
       callback(data.toJSON());
     });
   } catch (err) {
     return null;
   }
};

/**
 * get Token List
 * @param {ApiPromise} api
 * @returns {Object} Token List
 */
async function getTokenList(api: ApiPromise) {
   const provider = api || (await buildConnection('local'));
   const data: any = await provider.query.tokens.tokenData.entries();
   if(!data) return null;
   return data.map(([{ args: [currencyCode] }, value]) => ({
      name: value.toHuman().tokenName,
      currencyCode: value.toHuman().currencyCode,
      decimal: value.toHuman().decimal,
      blockNumber: value.toHuman().blockNumber,
   })
  );
}

/**
 * Get any liquidity locks of a token type under an account
 * @param {String} currencyCode
 * @param {String} did
 * @param {ApiPromise} api
 */
 async function getLocks(
   currencyCode: String,
   did: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.locks(sanitiseCCode(currencyCode), sanitiseDid(did))).toJSON();
}

/**
 * Storage map between currency code and block number 
 * @param {ApiPromise} api
 * @param {String} currencyCode (Optional)
 */
 async function removedTokens(
   api: ApiPromise,
   currencyCode?: String,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.removedTokens(sanitiseCCode(currencyCode))).toJSON();
}

/**
 * Token currency counter
 * @param {ApiPromise} api
 */
 async function tokenCurrencyCounter(
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenCurrencyCounter()).toString();
}

/**
 * Map to store a friendly token name for token
 * @param {string | null} currencyCode
 * @param {ApiPromise} api
 */
 async function tokenData(
   currencyCode: string | null,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenData(sanitiseCCode(currencyCode))).toJSON();
}

/**
 * Get Token Information
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Currency Id
 */
async function tokenInfo(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenInfo(sanitiseCCode(currencyCode))).toString();
}

/**
 * Reverse lookup Token Information
 * @param {Number} currencyId
 * @param {ApiPromise} api
 * @returns {HexString} Currency Code Hex
 */
 async function tokenInfoRLookup(
   currencyId: Number,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenInfoRLookup(currencyId)).toHex();
}

/**
 * Lookup Token Issuer
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {HexString} Token Owner DID Hex
 */
 async function tokenIssuer(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.tokenIssuer(sanitiseCCode(currencyCode))).toHex();
}

/**
 * Get Total Token Issuance
 * @param {String} currencyCode
 * @param {ApiPromise} api
 * @returns {Number} Token Issuance
 */
async function totalIssuance(
   currencyCode: String,
   api: ApiPromise,
  ) {
   const provider = api || (await buildConnection('local'));
   return (await provider.query.tokens.totalIssuance(sanitiseCCode(currencyCode))).toString();
}

export {
   issueToken,
   mintToken,
   removeToken,
   getBalance,
   setBalance,
   getDetailedBalance,
   subscribeToBalanceChanges,
   subscribeToDetailedBalanceChanges,
   slashToken,
   transfer,
   transferAll,
   transferTokenWithMemo,
   transferToken,
   sanitiseCCode,
   getLocks,
   removedTokens,
   tokenCurrencyCounter,
   getTokenList,
   tokenData,
   tokenInfo,
   tokenInfoRLookup,
   tokenIssuer,
   totalIssuance
};