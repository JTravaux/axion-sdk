const { FOREIGN_ADDRESS } = require('../util/constants');

class ForeignSwap {

    /**
    * Construct a class that contains properties and methods 
    * related to Axion's ForeignSwap contract.
    *
    * @class
    * @constructor
    * @param contract - A valid `web3.eth.Contract` object
    */ constructor(contract) {
        this.contract = contract;
        this.address = FOREIGN_ADDRESS;
    }

    
}

module.exports = ForeignSwap;