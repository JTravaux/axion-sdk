const Eth = require('web3-eth');
const Token = require('./src/token');
const Auction = require('./src/auction');
const Staking = require('./src/staking');
const BigPayDay = require('./src/bigPayDay');
const ForeignSwap = require('./src/foreignSwap');

const BPD_ABI = require('./contracts/bpd.json');
const TOKEN_ABI = require('./contracts/token.json');
const STAKING_ABI = require('./contracts/staking.json');
const AUCTION_ABI = require('./contracts/auction.json');
const FOREIGN_ABI = require('./contracts/foreign_swap.json');

// LAYER 1 CONTRACTS (LEGACY DATA)
const AUCTION_ABI_L1 = require('./contracts//layer1/auction.json');
const STAKING_ABI_L1 = require('./contracts//layer1/staking.json');


const {
    BPD_ADDRESS,
    TOKEN_ADDRESS,
    STAKING_ADDRESS,
    AUCTION_ADDRESS,
    FOREIGN_ADDRESS,
    LAYER_1_AUCTION_ADDRESS,
    LAYER_1_STAKING_ADDRESS,
} = require('./util/constants');

class Axion {
    
    /**
    * Construct a class that contains properties and methods
    * to access data from the Axion smart contracts on the Ethereum blockchain.
    * 
    * Most Ethereum-supported browsers like MetaMask have an compliant provider available at `window.ethereum`.
    * For web3.js users, check `Web3.givenProvider` or `Eth.givenProvider`. If this property is `null`, or if this code is running on a server,
    * you should pass a string to connect to a remote node such as infura.
    * @class
    * @constructor
    * @param provider - The provider to be used for the requests
    */ constructor(provider) {
        if(!provider)
            throw new Error("Unable to construct object: no provider given");
        
        const eth = new Eth(provider);
        const BPD_CONTRACT = new eth.Contract(BPD_ABI, BPD_ADDRESS);
        const TOKEN_CONTRACT = new eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
        const FOREIGN_SWAP_CONTRACT = new eth.Contract(FOREIGN_ABI, FOREIGN_ADDRESS);
        
        const STAKING_L1_CONTRACT = new eth.Contract(STAKING_ABI_L1, LAYER_1_STAKING_ADDRESS);
        const STAKING_L2_CONTRACT = new eth.Contract(STAKING_ABI, STAKING_ADDRESS);

        const AUCTION_L2_CONTRACT = new eth.Contract(AUCTION_ABI, AUCTION_ADDRESS);
        const AUCTION_L1_CONTRACT = new eth.Contract(AUCTION_ABI_L1, LAYER_1_AUCTION_ADDRESS);

        // Initialize properties
        this.bpd = new BigPayDay(BPD_CONTRACT);
        this.token = new Token(TOKEN_CONTRACT);
        this.foreignSwap = new ForeignSwap(FOREIGN_SWAP_CONTRACT);
        this.staking = new Staking(STAKING_L1_CONTRACT, STAKING_L2_CONTRACT);
        this.auction = new Auction(AUCTION_L1_CONTRACT, AUCTION_L2_CONTRACT);

        // Helpful utility methods
        this.util = {
            getProvider: () => eth,
            getCurrentBlock: () => eth.getBlockNumber()
        }
    }
}

module.exports = Axion;