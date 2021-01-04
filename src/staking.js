const { STAKING_ADDRESS } = require('../util/constants');

class Staking {

    /**
    * Construct a class that contains properties and methods 
    * related to Axion's Staking contract.
    *
    * @class
    * @constructor
    * @param contract1 - A valid `web3.eth.Contract` object  (layer 1 contract)
    * @param contract2 - A valid `web3.eth.Contract` object (layer 2 contract)
    */ constructor(contract1, contract2) {
        this.contract = contract2;
        this.contract_L1 = contract1;
        this.address = STAKING_ADDRESS;
    }

    /**
    * Get the global share rate.
    * @returns {Promise<string>} Promise that resolves to the current share rate
    */ getShareRate() {
        return this.contract.methods.shareRate().call()
    }

    /**
    * Get the total number of shares in existance.
    * @returns {Promise<string>} Promise that resolves to the current number of shares
    */ getTotalShares() {
        return this.contract.methods.sharesTotalSupply().call();
    }

    /**
    * Subscribe to auction 'Stake' events. Occurs when someone creates a new stake.
    * @returns {Promise<EventEmitter>} Promise that resolves to an EventEmitter.
    */ subscribeToStakeEvents() {
        return this.contract.events.Stake();
    }

    /**
    * Subscribe to auction 'Unstake' events. Occurs when someone unstakes.
    * @returns {Promise<EventEmitter>} Promise that resolves to an EventEmitter.
    */ subscribeToUnstakeEvents() {
        return this.contract.events.Unstake();
    }

    /**
    * Get Stake events between two blocks.
    * @param {string|number} start - The block to start from
    * @param {string|number} end - The block to end on. Defaults to latest block if omitted.
    * @returns {Promise<EventData[]>} Promise that resolves to an array of the Stake events.
    */ getPastStakeEvents(start, end = 'latest') {
        if (!start)
            throw new Error("Missing parameter: You must provide a start block.");
        else {
            return this.contract.getPastEvents("Stake", {
                fromBlock: start,
                toBlock: end
            });
        }
    }

    /**
    * Get Unstake events between two blocks.
    * @param {string|number} start - The block to start from
    * @param {string|number} end - The block to end on. Defaults to latest block if omitted.
    * @returns {Promise<EventData[]>} Promise that resolves to an array of the Unstake events.
    */ getPastUnstakeEvents(start, end = 'latest') {
        if (!start)
            throw new Error("Missing parameter: You must provide a start block.");
        else {
            return this.contract.getPastEvents("Unstake", {
                fromBlock: start,
                toBlock: end
            });
        }
    }
}

module.exports = Staking;