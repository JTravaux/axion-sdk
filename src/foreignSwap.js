const { FOREIGN_ADDRESS } = require('../util/constants');

class ForeignSwap {
    constructor(contract) {
        this.contract = contract;
        this.address = FOREIGN_ADDRESS;
    }

    
}

module.exports = ForeignSwap;