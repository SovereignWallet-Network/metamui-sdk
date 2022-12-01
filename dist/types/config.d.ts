import { Keyring } from '@polkadot/api';
import { KeypairType } from '@polkadot/util-crypto/types';
declare const METABLOCKCHAIN_PROVIDER: {
    LOCAL: string;
    DEV: string;
    TESTNET: string;
    DEMO: string;
    MAINNET: string[];
};
declare const SSID_BASE_URL: {
    local: string;
    dev: string;
    testnet: string;
    mainnet: string;
};
declare const initKeyring: (type?: KeypairType) => Promise<Keyring>;
export { METABLOCKCHAIN_PROVIDER, SSID_BASE_URL, initKeyring, };
