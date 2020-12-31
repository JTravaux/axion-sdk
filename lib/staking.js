const { STAKING_ADDRESS } = require('../util/constants');

class Staking {
    constructor(contract) {
        this.contract = contract;
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
}

module.exports = Staking;