import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";

async function submitTransaction(signedTx:SubmittableExtrinsic<"promise", ISubmittableResult>, api:ApiPromise): Promise<any> {
    console.log("Submit Txn Called");
    await new Promise<any>((resolve, reject) => {
        signedTx.send(function ({ status, dispatchError }) {
            console.log('Transaction status:', status.type);
            if (dispatchError) {
                if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                    const { docs, section, name } = decoded;
                    console.log(`${section}.${name}: ${docs.join(' ')}`);
                    return reject(new Error(`${section}.${name}`));
                } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    return reject(new Error(dispatchError.toString()));
                }
            } else if (status.isFinalized) {
                console.log('Finalized block hash', status.asFinalized.toHex());
                return resolve(signedTx.hash.toHex())
            }
        });
    });
}

export { submitTransaction };