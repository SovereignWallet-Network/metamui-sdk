declare const VCType: {
    TokenVC: string;
    MintTokens: string;
    SlashTokens: string;
    TokenTransferVC: string;
    SlashMintTokens: string;
    GenericVC: string;
    PublicDidVC: string;
    PrivateDidVC: string;
};
declare const METABLOCKCHAIN_TYPES: {
    MaxMetadata: string;
    MaxRegNumLen: string;
    MaxCompNameLen: string;
    PeerId: string;
    identifier: string;
    public_key: string;
    metadata: string;
    VCProp: string;
    RegistrationNumber: string;
    CompanyName: string;
    PrivateDidVC: {
        public_key: string;
        did: string;
    };
    PublicDidVC: {
        public_key: string;
        registration_number: string;
        company_name: string;
        did: string;
    };
    PrivateDid: {
        identifier: string;
        public_key: string;
        metadata: string;
    };
    PublicDid: {
        identifier: string;
        public_key: string;
        metadata: string;
        registration_number: string;
        company_name: string;
    };
    Did: string;
    DIDType: {
        _enum: {
            Public: string;
            Private: string;
        };
    };
    PublicKey: string;
    Address: string;
    LookupSource: string;
    Balance: string;
    TreasuryProposal: {
        proposer: string;
        beneficiary: string;
        value: string;
        bond: string;
    };
    CurrencyId: string;
    Amount: string;
    Memo: string;
    AccountInfo: string;
    VC: {
        hash: string;
        owner: string;
        issuers: string;
        signatures: string;
        is_vc_used: string;
        is_vc_active: string;
        vc_type: string;
        vc_property: string;
    };
    VCType: {
        _enum: string[];
    };
    TokenVC: {
        token_name: string;
        reservable_balance: string;
        decimal: string;
        currency_code: string;
    };
    SlashMintTokens: {
        vc_id: string;
        amount: string;
    };
    TokenTransferVC: {
        vc_id: string;
        amount: string;
    };
    GenericVC: {
        cid: string;
    };
    VCHash: string;
    VCStatus: {
        _enum: string[];
    };
    VCid: string;
    Hash: string;
    Signature: string;
    TokenDetails: {
        token_name: string;
        currency_code: string;
        decimal: string;
        block_number: string;
    };
    TokenBalance: string;
    TokenAccountData: {
        free: string;
        reserved: string;
        frozen: string;
    };
    TokenAccountInfo: {
        nonce: string;
        data: string;
    };
    Votes: {
        index: string;
        threshold: string;
        ayes: string;
        nays: string;
        end: string;
    };
    CurrencyCode: string;
    StorageVersion: {
        _enum: string[];
    };
    VCPalletVersion: {
        _enum: string[];
    };
};
declare const TOKEN_NAME_BYTES = 16;
declare const CURRENCY_CODE_BYTES = 8;
declare const VC_PROPERTY_BYTES = 128;
declare const CID_BYTES = 64;
/**
 * @param  {Bytes} inputBytes u8[]
 */
declare const bytesToHex: (inputBytes: any) => `0x${string}`;
/**
 * @param  {String} inputString
 */
declare const hexToBytes: (inputString: any) => Uint8Array;
/**
 * @param  {Base58} bs58string
 */
declare const base58ToBytes: (bs58string: any) => Uint8Array;
/**
 * @param  {String} inputString
 */
declare const stringToBytes: (inputString: any) => Uint8Array;
/**
 * @param  {Hex} hexString
 */
declare const hexToString: (hexString: any) => string;
/**
 * @param {Hex} hexString
 */
declare const vcHexToVcId: (hexString: any) => `0x${string}`;
/** Encodes object/ string of given type to hex
 * @param  {Object | String} data Object to be encoded
 * @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {String} Encoded Hex
 */
declare function encodeData(data: any, typeKey: any): any;
/** Decodes hex of given type to it's corresponding object/value
 * @param  {String} hexValue Hex String to be decoded
 * @param  {String} typeKey Key from METABLOCKCHAIN_TYPES which represents type of data
 * @returns {Object | String} Decoded Object/String
 */
declare function decodeHex(hexValue: any, typeKey: any): any;
/** Checks if str is upper and only contains characters
 * @param  {} str
 * @returns bool
 */
declare function isUpperAndValid(str: any): boolean;
/** Sort object by keys
 * @param  {Object} unorderedObj unordered object
 * @returns {Object} ordered object by key
 */
declare function sortObjectByKeys(unorderedObj: any): {};
/** generate blake hash of js object
 * @param  {Object} unordered unordered object
 * @returns {Object} ordered object by key
 */
declare function generateObjectHash(object: any): `0x${string}`;
export { METABLOCKCHAIN_TYPES, TOKEN_NAME_BYTES, CURRENCY_CODE_BYTES, VC_PROPERTY_BYTES, CID_BYTES, VCType, bytesToHex, hexToBytes, base58ToBytes, hexToString, stringToBytes, encodeData, decodeHex, vcHexToVcId, isUpperAndValid, sortObjectByKeys, generateObjectHash, };
