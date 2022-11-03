import { u8aToHex, hexToU8a, stringToHex } from "@polkadot/util";
import { signatureVerify } from "@polkadot/util-crypto";
import { sha256 } from "js-sha256";
import { getDIDDetails, getDidKeyHistory, isDidValidator } from "./did";

async function createVC(propertiesJson, schemaToTest) {
    return {
        properties: propertiesJson,
        hash: stringToHex(sha256(JSON.stringify(propertiesJson))),
        verifier: undefined,
        signature: undefined,
    };
}

async function signVC(vcJson, verifierDid, signingKeyPair) {
    const expectedHash = stringToHex(sha256(JSON.stringify(vcJson.properties)));
    if (expectedHash !== vcJson.hash) {
        throw new Error("Data mismatch");
    }

    const dataToSign = hexToU8a(vcJson.hash);
    const signedData = signingKeyPair.sign(dataToSign);
    const resVC = vcJson;
    resVC.verifier = verifierDid;
    resVC.signature = u8aToHex(signedData);
    return resVC;
}

async function verifyVC(vcJson, api) {
    const provider = api;
    if(!vcJson.verifier || !vcJson.signature) {
        throw new Error("VC Not signed!");
    }

    const expectedHash = stringToHex(sha256(JSON.stringify(vcJson.properties)));
    if (expectedHash !== vcJson.hash) {
        throw new Error("Data mismatch");
    }

    const isSignerValidator = await isDidValidator(vcJson.verifier, provider);
    if (!isSignerValidator) {
        throw new Error("VC Not signed by a validator!");
    }

    const didDetails: any = await getDIDDetails(vcJson.verifier, provider);
    let signerAddress = didDetails.public_key;

    if(didDetails.added_block > parseInt(vcJson.properties.issued_block, 10)) {
        console.log('Signing key has been rotated, searching for previous key history');
        const prevKeyDetails:any = await getDidKeyHistory(vcJson.verifier, provider);
        prevKeyDetails.forEach(([accountId, blockNo]) => {
            if(parseInt(vcJson.properties.issued_block, 10) > blockNo) {
                console.log('Signing Key Found!');
                signerAddress = accountId;
            }
        });
    }

    return signatureVerify(hexToU8a(vcJson.hash), hexToU8a(vcJson.signature), signerAddress.toString()).isValid;
}

async function createSsidVC(propertiesJson) {
    return {
        properties: propertiesJson,
        hash: stringToHex(sha256(JSON.stringify(propertiesJson))),
        signature: undefined,
    };
}

async function signSsidVC(vcJson, signingKeyPair) {
    const dataToSign = hexToU8a(vcJson.hash);
    const signedData = signingKeyPair.sign(dataToSign);
    const resVC = vcJson;
    resVC.signature = u8aToHex(signedData);
    return resVC;
}

async function verifySsidVC(vcJson) {
    return signatureVerify(
        hexToU8a(vcJson.hash),
        hexToU8a(vcJson.signature),
        vcJson.properties.public_key.toString()
    ).isValid;
}
export { 
    createVC, 
    signVC,
    verifyVC,
    createSsidVC,
    signSsidVC,
    verifySsidVC
};