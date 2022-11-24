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
exports.initKeyring = exports.SSID_BASE_URL = exports.METABLOCKCHAIN_PROVIDER = void 0;
const api_1 = require("@polkadot/api");
const util_crypto_1 = require("@polkadot/util-crypto");
const METABLOCKCHAIN_PROVIDER = {
    LOCAL: 'ws://127.0.0.1:9944',
    DEV: 'wss://n1devnet.metabit.exchange',
    TESTNET: 'wss://n3testnet.metabit.exchange',
    DEMO: 'wss://demo.metamui.money',
    MAINNET: ['wss://n2.metamui.id', 'wss://n1.metamui.id', 'wss://n3.metamui.id', 'wss://n4.metamui.id'],
};
exports.METABLOCKCHAIN_PROVIDER = METABLOCKCHAIN_PROVIDER;
const SSID_BASE_URL = {
    local: 'https://ssid.metabit.exchange/dev',
    dev: 'https://ssid.metabit.exchange/dev',
    testnet: 'https://ssid.metabit.exchange/dev',
    mainnet: 'https://ssid.metabit.exchange/prod',
};
exports.SSID_BASE_URL = SSID_BASE_URL;
const initKeyring = (type = 'sr25519') => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, util_crypto_1.cryptoWaitReady)();
    return new api_1.Keyring({ type });
});
exports.initKeyring = initKeyring;

//# sourceMappingURL=config.js.map
