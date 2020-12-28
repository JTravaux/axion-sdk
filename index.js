var Eth = require('web3-eth');
var Contract = require('web3-eth-contract');

const STAKING_ABI = require('./contracts/staking.json');
const AUCTION_ABI = require('./contracts/auction.json');

const STAKING_ADDRESS = '0x1920d646574E097c2c487F69F40814F95d45bf8C';
const AUCTION_ADDRESS = "0xCc9bEC9EE79259C7757a24C288fB5CEAbC9ca40B";

module.exports = class {

    constructor(provider) {
        this.eth = new Eth(provider);
        this.staking = new Contract(STAKING_ABI, STAKING_ADDRESS);
        this.auction = new Contract(AUCTION_ABI, AUCTION_ADDRESS);
    }

    getCurrentBlock() {
        return this.eth.getBlockNumber();
    }
}
