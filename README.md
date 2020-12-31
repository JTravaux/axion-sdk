# Axion SDK
Easily access information directly from the Axion smart contracts on the Ethereum blockchain.

### Setup
- Clone this repository ``git clone https://github.com/JTravaux/axion-sdk.git``
- Package it up ``npm pack``
- Open the generated .tgz file & copy contents of the `package` folder to a new `axion-sdk` folder within the `node_modules` folder. 

#### Dependencies
- ``web3-eth`` for interacting with the smart contracts
    - This package comes with the main web3.js package. So if you've already installed that, you're good to go.
- ``@uniswap/sdk`` for pricing, volume, and liquidity data
- ``@ethersproject/solidity`` uniswap sdk dependency
- ``@ethersproject/contracts`` uniswap sdk dependency
- ``@ethersproject/providers`` uniswap sdk dependency

### Usage
If using in a browser: 
```javascript
import Web3 from 'web3';
import Axion from 'axion-sdk';

const axion = new Axion(Web3.givenProvider);
```

If using on a server, you can use a local or remote node: 
```javascript
const Axion = require('axion-sdk');

const axion = new Axion("https://mainnet.infura.io/...");
const axion_ws = new Axion("wss://mainnet.infura.io/ws/...");
```
