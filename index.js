var Eth = require('web3-eth');

const BPD_ABI = require('./contracts/bpd.json');
const STAKING_ABI = require('./contracts/staking.json');
const AUCTION_ABI = require('./contracts/auction.json');
const FOREIGN_SWAP_ABI = require('./contracts/foreign_swap.json');

const BPD_ADDRESS = "0xCF39754913b41946379c130B203Bf8406460D020";
const TOKEN_ADDRESS = "0x71F85B2E46976bD21302B64329868fd15eb0D127";
const STAKING_ADDRESS = '0x1920d646574E097c2c487F69F40814F95d45bf8C';
const AUCTION_ADDRESS = "0xCc9bEC9EE79259C7757a24C288fB5CEAbC9ca40B";
const FOREIGN_SWAP_ADDRESS = "0x12E54c7408Ac4d8885070ED7B379fe615E71C2d1";

module.exports = class {
    
    /**
    * Construct a class that contains methods
    * to access data from the Axion smart contracts.
    * Most Ethereum-supported browsers like MetaMask have an EIP-1193 compliant provider available at `window.ethereum`.
    * For web3.js, check `Web3.givenProvider`. If this property is `null` you should connect to a remote node such as infura (`"https://mainnet.infura.io/..."`), or a local node.
    * @class
    * @constructor
    * @param provider - The provider to be used for web3.js
    */ constructor(provider) {
        if(!provider)
            throw new Error("Unable to construct object: no provider given");
        
        this.eth = new Eth(provider);
        this.bpd = new this.eth.Contract(BPD_ABI, BPD_ADDRESS);
        this.staking = new this.eth.Contract(STAKING_ABI, STAKING_ADDRESS);
        this.auction = new this.eth.Contract(AUCTION_ABI, AUCTION_ADDRESS);
        this.foreignSwap = new this.eth.Contract(FOREIGN_SWAP_ABI, FOREIGN_SWAP_ADDRESS);
    }

    /**
    * Get the global share rate.
    * @returns {Promise<string>} Promise that resolves to the current share rate
    */ getShareRate = () => this.staking.methods.shareRate().call();

    /**
    * Get the total number of shares in existance.
    * @returns {Promise<string>} Promise that resolves to the current number of shares
    */ getTotalShares = () => this.staking.methods.sharesTotalSupply().call();

    /**
    * Get the reserves of a specific auction.
    * @param {string} id - The ID of the auction to check
    * @returns {Promise<any>} Promise that resolves to the auction reserves of the specified auction. The structure is as follows:
    * @property `eth` - The amount of ETH in the reserve
    * @property `axn` - The amount of AXN in the reserve
    * @property `lastPrice` - The last price from uniswap (per ETH)
    * @property `middlePrice` - The 7-day average price from uniswap (per ETH)
    */ getAuctionReserves = id => {
        if (!id)
            throw new Error("Missing parameter: You must provide the id of the auction.");
        else {
            return new Promise((resolve, reject) => {
                this.auction.methods.reservesOf(id).call()
                .then(reserves => {
                    resolve({
                        eth: reserves.eth,
                        axn: reserves.token,
                        lastPrice: reserves.uniswapLastPrice,
                        middlePrice: reserves.uniswapMiddlePrice,
                    })
                })
                .catch(err => reject(err))
            })
        }
    }
    
    /**
    * Get the id of the current auction.
    * @returns {Promise<string>} Promise that resolves to the current auction ID.
    */ getCurrentAuctionID = () => this.auction.methods.calculateStepsFromStart().call();

    /**
    * Get the id of the next weekly auction.
    * @returns {Promise<string>} Promise that resolves to the ID of the next weekly auction.
    */ getNextWeeklyAuctionID = () => this.auction.methods.calculateNearestWeeklyAuction().call();

    /**
    * Get the average price for the last 7 days, the current auction bid.
    * @returns {Promise<string>} Promise that resolves to the average price per ETH of Axion.
    */ getCurrentAuctionBid = () => this.auction.methods.getUniswapMiddlePriceForSevenDays().call();
    
    /**
    * Get the amount of Axion in the next BigPayday.
    * @returns {Promise<string>} Promise that resolves to the amount of Axion in the next BigPayday
    */ getNextBigPaydayAmount = () => this.bpd.methods.getClosestPoolAmount().call();
    
    /**
    * Get the amount of Axion in each BigPayday.
    * @returns {Promise<string[]>} Promise that resolves to an array containing the amount of Axion in each BigPayday
    */ getAllBigPaydayAmounts = () => this.bpd.methods.getPoolYearAmounts().call();

    /********************
    * UTIL/MISC METHODS *
    ********************/
    util = {
        getCurrentBlock: () => this.eth.getBlockNumber(),
        getAxionTokenAddress: () => TOKEN_ADDRESS
    }
}