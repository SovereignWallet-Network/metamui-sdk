import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
declare function submitTransaction(signedTx: SubmittableExtrinsic<"promise", ISubmittableResult>, api: ApiPromise): Promise<any>;
export { submitTransaction };
