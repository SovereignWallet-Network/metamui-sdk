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

### Build

You can build the project by running the following command below.  
```bash
yarn build
```
If you want to do a clean install, you can run the following command in project's ROOT directory to re-build the project.  
```bash
yarn build:clean
```

### Test

##### Run all tests (Local)
```bash
yarn test:local
```
##### Run tests (Dev)
```bash
env SWN_MNEMONICyarn test:dev
```

##### Run single module tests
```bash
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