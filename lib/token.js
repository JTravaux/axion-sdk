const { TOKEN_ADDRESS } = require('../util/constants');

class Token {
    constructor(contract) {
        this.contract = contract;
        this.address = TOKEN_ADDRESS;
    }

    /**
    * Get the total supply of Axion.
    * @returns {Promise<string>} Promise that resolves to the current total supply
    */ getTotalSupply() {
        return this.contract.methods.totalSupply().call();
    }
}

module.exports = Token;