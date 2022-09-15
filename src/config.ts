import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';

export const METABLOCKCHAIN_PROVIDER = {
  LOCAL: 'ws://127.0.0.1:9944',
  DEV: 'wss://n3testnet.metabit.exchange',
  TESTNET: 'wss://n3testnet.metabit.exchange',
  DEMO: 'wss://demo.metamui.money',
  MAINNET: ['wss://n2.metamui.id', 'wss://n1.metamui.id', 'wss://n3.metamui.id', 'wss://n4.metamui.id'],
};

export const SSID_BASE_URL = {
  local: 'https://ssid.metabit.exchange/dev',
  dev: 'https://ssid.metabit.exchange/dev',
  testnet: 'https://ssid.metabit.exchange/dev',
  mainnet: 'https://ssid.metabit.exchange/prod',
}

export const initKeyring = async (type: any = 'sr25519') => {
  await cryptoWaitReady();
  const keyring = await new Keyring({ type });
  return keyring;
};

module.exports = {
  METABLOCKCHAIN_PROVIDER,
  SSID_BASE_URL,
  initKeyring,
};
