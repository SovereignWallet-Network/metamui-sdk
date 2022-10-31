import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';

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
}

const initKeyring = async (type: KeypairType = 'sr25519') => {
  await cryptoWaitReady();
  return new Keyring({ type });
};

export {
  METABLOCKCHAIN_PROVIDER,
  SSID_BASE_URL,
  initKeyring,
};
