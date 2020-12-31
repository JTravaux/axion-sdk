# Axion SDK
Easily access information directly from the Axion smart contracts on the Ethereum blockchain.

### Setup
- Clone this repository ``git clone https://github.com/JTravaux/axion-sdk.git``
- Package it up ``npm pack``
- Open the generated .tgz file & copy contents of the `package` folder to a new `axion-sdk` folder within the `node_modules` folder. 
- Install the only dependency: ``npm i web3-eth``

npm coming soon™?
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
