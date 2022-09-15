export const validSchema = '0x15733EA25E1C3A1A8F2330D1B64E80B765971A370653943DB57A2099EF0EDF1F';
export const inValidSchema = '0x15733EA25E1C3A1A8F2330D1B64E80B765971A370653943DB57A2099EF0EDF1G';
export const mnemonicWithBalance = '//Alice'; // this mnemonic should have balance for test to pass
export const didOfMnemonicWithBalance = 'Alice'; // this should match chain data
export const providerNetwork = process.env.PROVIDER_NETWORK || 'testnet';

module.exports = {
  validSchema,
  inValidSchema,
  mnemonicWithBalance,
  didOfMnemonicWithBalance,
  providerNetwork,
};
