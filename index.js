const Eth = require('web3-eth');
const Auction = require('./src/auction');
const BigPayDay = require('./src/bigPayDay');
const ForeignSwap = require('./src/foreignSwap');
const Staking = require('./src/staking');
const Token = require('./src/token');

const BPD_ABI = require('./contracts/bpd.json');
const TOKEN_ABI = require('./contracts/token.json');
const STAKING_ABI = require('./contracts/staking.json');
const AUCTION_ABI = require('./contracts/auction.json');
const FOREIGN_ABI = require('./contracts/foreign_swap.json');

const {
    BPD_ADDRESS,
    TOKEN_ADDRESS,
    STAKING_ADDRESS,
    AUCTION_ADDRESS,
    FOREIGN_ADDRESS
} = require('./util/constants');

class Axion {
    
    /**
    * Construct a class that contains properties and methods
    * to access data from the Axion smart contracts.
    * 
    * Most Ethereum-supported browsers like MetaMask have an EIP-1193 compliant provider available at `window.ethereum`.
    * For web3.js, check `Web3.givenProvider`. If this property is `null`, or if this code is running on a server,
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
        const STAKING_CONTRACT = new eth.Contract(STAKING_ABI, STAKING_ADDRESS);
        const AUCTION_CONTRACT = new eth.Contract(AUCTION_ABI, AUCTION_ADDRESS);
        const FOREIGN_SWAP_CONTRACT = new eth.Contract(FOREIGN_ABI, FOREIGN_ADDRESS);

        // Initialize "public" variables
        this.provider = eth;
        this.bpd = new BigPayDay(BPD_CONTRACT);
        this.token = new Token(TOKEN_CONTRACT);
        this.staking = new Staking(STAKING_CONTRACT);
        this.auction = new Auction(AUCTION_CONTRACT);
        this.foreignSwap = new ForeignSwap(FOREIGN_SWAP_CONTRACT);

        // Helpful utility methods
        this.util = {
            getCurrentBlock: () => this.eth.getBlockNumber()
        }
    }
}

module.exports = Axion;