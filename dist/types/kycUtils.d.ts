/**
 *
 * @param propertiesJson
 * @returns {Object} Create Unsigned VC
 */
declare function createVC(propertiesJson: any): Promise<{
    properties: any;
    hash: `0x${string}`;
    verifier: any;
    signature: any;
}>;
/**
 * @param {JSON} vcJson
 * @param {string} verifierDid
 * @param {string} signingKeyPair
 * @returns {Object} Signed VC
 */
declare function signVC(vcJson: any, verifierDid: any, signingKeyPair: any): Promise<any>;
/**
 *
 * @param vcJson
 * @param api
 * @returns {boolean} true or false
 */
declare function verifyVC(vcJson: any, api: any): Promise<boolean>;
/**
 * @param propertiesJson
 * @returns {Object} Create Unsigned VC
 */
declare function createSsidVC(propertiesJson: any): Promise<{
    properties: any;
    hash: `0x${string}`;
    signature: any;
}>;
/**
 * @param vcJson
 * @param signingKeyPair
 * @returns {Object} Signed VC
 */
declare function signSsidVC(vcJson: any, signingKeyPair: any): Promise<any>;
/**
 * @param vcJson
 * @returns {boolean} true or false
 */
declare function verifySsidVC(vcJson: any): Promise<boolean>;
export { createVC, signVC, verifyVC, createSsidVC, signSsidVC, verifySsidVC };
