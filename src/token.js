const { TOKEN_ADDRESS, USDT_ADDRESS, ONE_18_ZEROS } = require('../util/constants');
const { Fetcher, Trade, Route, TradeType, WETH, ChainId, Token: UniswapToken, TokenAmount } = require('@uniswap/sdk');

class Token {
    constructor(contract) {
        this.contract = contract;
        this.address = TOKEN_ADDRESS;

        this.usdt_token = new UniswapToken(ChainId.MAINNET, USDT_ADDRESS, 6);
        this.axn_token = new UniswapToken(ChainId.MAINNET, TOKEN_ADDRESS, 18);
    }

    /**
    * Get the circulating supply of Axion.
    * @returns {Promise<string>} Promise that resolves to the current circulating supply
    */ getCirculatingSupply() {
        return this.contract.methods.totalSupply().call();
    }

    /**
    * Get the amount of Axion you would currently get for 1 ETH.
    * @returns {Promise<string>} Promise that resolves to the current AXN cost per 1 ETH
    */getAxionPricePerEth() {
        return new Promise(async (resolve, reject) => {
            try {

                // TODO: Add the 3rd parameter, Provider.
                const PAIR = await Fetcher.fetchPairData(WETH[this.axn_token.chainId], this.axn_token);
                const TRADE = new Trade(
                    new Route([PAIR], WETH[this.axn_token.chainId]),
                    new TokenAmount(WETH[this.axn_token.chainId], ONE_18_ZEROS),
                    TradeType.EXACT_INPUT
                )

                resolve(TRADE.executionPrice.toSignificant(6));
            } catch (err) { reject(err) }
        }) 
    }

    /**
    * Get the amount of price of 1 Axion in USDT.
    * @returns {Promise<string>} Promise that resolves to the current AXN cost in USDT
    */ getUsdtPricePerAxn() {
        return new Promise(async (resolve, reject) => {
            try {

                // TODO: Add the 3rd parameter, Provider.
                const AXIONETHPair = await Fetcher.fetchPairData(this.axn_token, WETH[ChainId.MAINNET])
                const ETHUSDTPair = await Fetcher.fetchPairData(WETH[ChainId.MAINNET], this.usdt_token)

                const TRADE = new Trade(
                    new Route([AXIONETHPair, ETHUSDTPair], this.axn_token),
                    new TokenAmount(this.axn_token, ONE_18_ZEROS),
                    TradeType.EXACT_INPUT
                )

                resolve(TRADE.executionPrice.toSignificant(6))
            } catch (err) { reject(err) }
        })
    }
}

module.exports = Token;