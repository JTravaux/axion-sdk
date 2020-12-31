const { BPD_ADDRESS } = require('../util/constants');

class BigPayDay {
    constructor(contract) {
        this.contract = contract;
        this.address = BPD_ADDRESS;
    }

    /**
    * Get the amount of Axion in the next BigPayday.
    * @returns {Promise<string>} Promise that resolves to the amount of Axion in the next BigPayday
    */ getNextBigPaydayAmount() {
        return this.contract.methods.getClosestPoolAmount().call();
    }

    /**
    * Get the amount of Axion in each BigPayday.
    * @returns {Promise<string[]>} Promise that resolves to an array containing the amount of Axion in each BigPayday
    */ getAllBigPaydayAmounts() {
        return this.contract.methods.getPoolYearAmounts().call();
    }
}

module.exports = BigPayDay;