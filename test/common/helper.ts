import * as did from '../../src/did';
import { buildConnection } from '../../src/connection';


const TEST_DID = 'did:ssid:rocket';
const TEST_DAVE_DID = "did:ssid:dave";
const TEST_SWN_DID = "did:ssid:swn";

// To remove DID after testing
/**
 * @param  {String} didString
 * @param  {KeyPair} sigKeyPair
 * @param  {Api} provider
 */
async function removeDid(didString, sigKeyPair, provider) {
  try {
    const api = provider || (await buildConnection('local'));
    const txn = api.tx.validatorCommittee.execute(
      api.tx.did.remove(did.sanitiseDid(didString)
    ),1000);
    const nonce = await api.rpc.system.accountNextIndex(sigKeyPair.address);
    await new Promise((resolve, reject) => txn.signAndSend(sigKeyPair, nonce, ({ status, dispatchError }) => {
      if (dispatchError) {
        reject('Dispatch error');
      } else if (status.isFinalized) {
        resolve(status.asFinalized.toHex());
      }
    }));
  } catch (err: any) {
    throw new Error(err);
  }
}

export {
  removeDid,
}