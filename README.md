# Axion SDK
Easily access information directly from the Axion smart contracts on the Ethereum blockchain.

### Setup
Using NPM, simply type: `npm i axion-sdk`

### Usage
If using in a browser: 
```javascript
import Axion from 'axion-sdk';

const axion = new Axion(Web3.givenProvider);
```

If using on a server, you can use a local or remote node: 
```javascript
const Axion = require('axion-sdk');

const axion = new Axion("https://mainnet.infura.io/...");
const axion_ws = new Axion("wss://mainnet.infura.io/ws/...");
```