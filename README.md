## Metamui-SDK
![Integration Test](https://github.com/SovereignWallet-Network/metamui-sdk/actions/workflows/node.js.yml/badge.svg)
<!-- [![npm version](https://badge.fury.io/js/metamui-sdk.svg)](https://badge.fury.io/js/metamui-sdk) -->

TS SDK to interface with MetaMUI Metablockchain node.

<!-- ## Install
```
npm install metamui-sdk
``` -->

## Usage  

### Network options

The best practice is to first create a websocket connection to the network you intend to connect with and then
pass this object to all function calls.
The available network options are `local`, `dev`, `testnet`, `mainnet`
If no network is specified, the functions default to either `dev` or `local`. 
When multiple nodes are being hosted, the user has to option to pass url of the node itself.

### Test

##### Run all tests (Local)
```
yarn test:local
```
##### Run tests (Dev)
```
yarn test:dev
```

### Modules

- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/connection.md">Connection</a>
- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/balances.md">Balances</a>
- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/collective.md">Collective</a>
- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/did.md">DID</a>
- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/token.md">Token</a>
- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/vc.md">VC</a>
- <a href="https://github.com/SovereignWallet-Network/metamui-sdk/blob/main/docs/utils.md">Utils</a>