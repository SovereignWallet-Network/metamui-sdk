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

##### Run single module tests
```
 env MODULE=<module-name> PROVIDER_NETWORK=<network-name> yarn test:module
```


### Modules
- [Connection](docs/connection.md)
- [Balances](docs/balances.md)
- [Collective](docs/collective.md)
- [DID](docs/did.md)
- [CacheDid](docs/cacheDid.md)
- [Token](docs/token.md)
- [Tokenchain](docs/tokenchain.md)
- [VC](docs/vc.md)
- [Utils](docs/utils.md)
- [kycUtils](docs/kycUtils.md)