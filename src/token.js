const { EtherscanProvider } = require("@ethersproject/providers");
const { TOKEN_ADDRESS, USDT_ADDRESS, ONE_18_ZEROS, ETHERSCAN_SHARED_API_KEY } = require('../util/constants');
const { Fetcher, Trade, Route, TradeType, WETH, ChainId, Token: UniswapToken, TokenAmount } = require('@uniswap/sdk');

class Token {

    /**
    * Construct a class that contains properties and methods 
    * related to Axion's Token contract.
    *
    * @class
    * @constructor
    * @param contract - A valid `web3.eth.Contract` object
    */ constructor(contract) {
        this.contract = contract;
        this.address = TOKEN_ADDRESS;
        this.provider = new EtherscanProvider(null, ETHERSCAN_SHARED_API_KEY)
        this.usdt_token = new UniswapToken(ChainId.MAINNET, USDT_ADDRESS, 6, "USDT", "Tether USD");
        this.axn_token = new UniswapToken(ChainId.MAINNET, TOKEN_ADDRESS, 18, "AXN", "Axion");
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
                const PAIR = await Fetcher.fetchPairData(WETH[this.axn_token.chainId], this.axn_token, this.provider);
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
                const AXIONETHPair = await Fetcher.fetchPairData(this.axn_token, WETH[ChainId.MAINNET], this.provider)
                const ETHUSDTPair = await Fetcher.fetchPairData(WETH[ChainId.MAINNET], this.usdt_token, this.provider)

                const TRADE = new Trade(
                    new Route([AXIONETHPair, ETHUSDTPair], this.axn_token),
                    new TokenAmount(this.axn_token, ONE_18_ZEROS),
                    TradeType.EXACT_INPUT
                )

                resolve(TRADE.executionPrice.toSignificant(6))
            } catch (err) { reject(err) }
        })
    }

    async getCirculatingMarketCap()  {
        const PRICE =  await this.getUsdtPricePerAxn();
        const SUPPLY = await this.getCirculatingSupply();
        const MARKET_CAP = PRICE * SUPPLY;
        return (MARKET_CAP / ONE_18_ZEROS);
    }
}

module.exports = Token;