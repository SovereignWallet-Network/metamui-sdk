var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
const METABLOCKCHAIN_PROVIDER = {
    LOCAL: 'ws://127.0.0.1:9944',
    DEV: 'wss://n1devnet.metabit.exchange',
    TESTNET: 'wss://n3testnet.metabit.exchange',
    DEMO: 'wss://demo.metamui.money',
    MAINNET: ['wss://n2.metamui.id', 'wss://n1.metamui.id', 'wss://n3.metamui.id', 'wss://n4.metamui.id'],
};
const SSID_BASE_URL = {
    local: 'https://ssid.metabit.exchange/dev',
    dev: 'https://ssid.metabit.exchange/dev',
    testnet: 'https://ssid.metabit.exchange/dev',
    mainnet: 'https://ssid.metabit.exchange/prod',
};
const initKeyring = (type = 'sr25519') => __awaiter(void 0, void 0, void 0, function* () {
    yield cryptoWaitReady();
    return new Keyring({ type });
});
export { METABLOCKCHAIN_PROVIDER, SSID_BASE_URL, initKeyring, };
